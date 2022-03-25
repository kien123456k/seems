﻿using AutoMapper;

using Microsoft.AspNetCore.Mvc;

using SEEMS.Contexts;
using SEEMS.Data.DTO;
using SEEMS.Data.DTOs;
using SEEMS.Data.Models;
using SEEMS.Data.ValidationInfo;
using SEEMS.Infrastructures.Attributes;
using SEEMS.Infrastructures.Commons;
using SEEMS.Models;
using SEEMS.Services;
using SEEMS.Services.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SEEMS.Controllers
{
	[Route("api/Reservations")]
	[ApiController]
	public class ReservationController : ControllerBase
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;
		private readonly IAuthManager _authManager;
		private IRepositoryManager _repoManager;
		public ReservationController(ApplicationDbContext context, IMapper mapper, IAuthManager authManager, IRepositoryManager repoManager)
		{
			_context = context;
			_mapper = mapper;
			_authManager = authManager;
			_repoManager = repoManager;
		}

		// POST api/Reservations
		// Register a event
		[HttpPost]
		[CheckUserStatus]
		public async Task<IActionResult> Post([FromBody] ReservationDTO reservationDTO)
		{
			try
			{
				var currentUser = await GetCurrentUser(_authManager.GetCurrentEmail(Request));
				if(currentUser == null)
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "Login to continue"));
				}

				var userId = currentUser.Id;
				var myEvent = _context.Events.FirstOrDefault(x => x.Id == reservationDTO.EventId);
				if(myEvent == null)
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "Invalid EventId"));
				}

				var reservation = _context.Reservations.FirstOrDefault(x => x.UserId == userId && x.EventId == reservationDTO.EventId);
				if(reservation != null)
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "You already registered this event "));
				}

				if(myEvent.RegistrationDeadline.CompareTo(DateTime.Now) < 0)
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "Registration time has expired."));
				}

				var registeredNum = _context.Reservations.Count(r => r.EventId == reservationDTO.EventId);
				if(!(registeredNum < myEvent.ParticipantNum))
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "This event has full slot. You can not register the event"));
				}

				reservation = _mapper.Map<Reservation>(reservationDTO);
				reservation.UserId = userId;
				_context.Add(reservation);
				_context.SaveChanges();

				return Ok(new Response(ResponseStatusEnum.Success, reservation));
			}
			catch(Exception ex)
			{
				return BadRequest(new Response(ResponseStatusEnum.Fail, "", ex.Message));
			}
		}

		// PUT api/Reservations/
		// Check/Uncheck attendance
		[HttpPut]
		[CheckUserStatus]
		public async Task<IActionResult> Put([FromBody] ReservationForAttendanceReqDTO attendance)
		{
			try
			{
				var currentUser = await GetCurrentUser(_authManager.GetCurrentEmail(Request));
				if(currentUser == null)
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "Login to continue."));
				}

				var role = (await _repoManager.UserMeta.GetRoleByUserIdAsync(currentUser.Id, false)).MetaValue;
				if(!role.Contains(RoleTypes.Admin.ToString()) && !role.Contains(RoleTypes.Organizer.ToString()))
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "You do not have permission."));
				}

				var reservation = _context.Reservations.FirstOrDefault(x => x.Id == attendance.Id);
				if(reservation == null)
				{
					return Ok(new Response(ResponseStatusEnum.Fail, "", "Invalid reservationId"));
				}

				if(reservation.Attend && attendance.Attend)
				{
					return Ok(
						new Response(
							ResponseStatusEnum.Success,
							new { ErrorCode = "ALREADY_ATTENDED" },
							"Already attended",
							200
						)
					);
				}
				else
				{
					reservation.Attend = attendance.Attend;
					_context.Reservations.Update(reservation);
					_context.SaveChanges();
					return Ok(new Response(ResponseStatusEnum.Success, ""));
				}
			}
			catch(Exception ex)
			{
				return BadRequest(new Response(ResponseStatusEnum.Fail, "", ex.Message));
			}
		}

		// GET api/Reservations
		// Get all registered events
		[HttpGet]
		[CheckUserStatus]
		public async Task<IActionResult> Get(string? search, bool? upcoming, bool? active, string? organizationName, int? lastReservationId, string? reservationStatus, int resultCount = 10)
		{
			string userRole = null;
			try
			{
				var currentUser = await GetCurrentUser(_authManager.GetCurrentEmail(Request));
				if(currentUser != null)
				{
					var userId = currentUser.Id;
					var listRegisteredEvents = _repoManager.Reservation.GetListRegisteredEvents(userId);
					userRole = (await _repoManager.UserMeta.GetRoleByUserIdAsync(userId, false)).MetaValue;
					if(listRegisteredEvents.Count() > 0)
					{
						IEnumerable<RegisteredEventsDTO> foundResult;
						if(upcoming == null)
						{
							foundResult = listRegisteredEvents;
						}
						else
						{
							foundResult = ((bool) upcoming ? listRegisteredEvents.Where(
								e => e.StartDate.Subtract(DateTime.Now).TotalMinutes >= 30) :
								listRegisteredEvents.Where(
								e => e.StartDate.Subtract(DateTime.Now).TotalMinutes <= 0));
						}

						if(active != null)
						{
							foundResult = ((bool) active
								? foundResult.Where(e => e.Active)
								: foundResult.Where(e => !e.Active));
						}

						//Filter by title
						if(!string.IsNullOrEmpty(search))
						{
							foundResult = foundResult.Where(e => e.EventTitle.Contains(search, StringComparison.CurrentCultureIgnoreCase));
						}

						if(organizationName != null)
						{
							foundResult = foundResult.Where(e => e.OrganizationName.Equals(organizationName));
						}


						foundResult.ToList().ForEach(e =>
							e.ReservationStatus = _repoManager.Reservation.GetRegisterEventStatus(e.ReservationId)
						);

						if(reservationStatus != null)
						{
							foundResult = foundResult.Where(e => e.ReservationStatus.Equals(reservationStatus));
						}

						foundResult = foundResult.OrderByDescending(e => e.StartDate).ToList();


						//Implement load more
						List<RegisteredEventsDTO> returnResult = null;
						bool failed = false;
						bool loadMore = false;
						int lastReservationIndex = 0;
						if(lastReservationId != null)
						{
							lastReservationIndex = foundResult.ToList().FindIndex(e => e.ReservationId == lastReservationId);
							if(lastReservationIndex > 0)
							{
								returnResult = foundResult.ToList().GetRange(
									lastReservationIndex + 1,
									Math.Min(resultCount, foundResult.Count() - lastReservationIndex - 1));
							}
							else
							{
								failed = true;
							}
						}
						else
						{
							returnResult = foundResult.OrderByDescending(e => e.StartDate).ToList().GetRange(0, Math.Min(foundResult.Count(), resultCount));
						}
						if(!failed && foundResult.Count() - lastReservationIndex - 1 > returnResult.Count())
						{
							loadMore = true;
						}

						return failed
							? BadRequest(
								new Response(ResponseStatusEnum.Fail, msg: "Invalid Id"))
							: Ok(new Response(
								ResponseStatusEnum.Success,
								new
								{
									Count = foundResult.Count(),
									CanLoadMore = loadMore,
									Events = returnResult
								}
							));
					}
					else
					{
						return Ok(new Response(ResponseStatusEnum.Success, "", "You have not registered to participate in any event yet"));
					}
				}
				else
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "Login to continue"));
				}
			}
			catch(Exception ex)
			{
				return BadRequest(new Response(ResponseStatusEnum.Fail, "", ex.Message));
			}
		}

		// GET api/Reservations/id
		// Get all user registered for an event
		[HttpGet("{id}")]
		[CheckUserStatus]
		public async Task<IActionResult> Get(int id)
		{
			try
			{
				var anEvent = _context.Events.FirstOrDefault(x => x.Id == id);
				if(anEvent == null)
				{
					return Ok(new Response(ResponseStatusEnum.Success, "", "Invalid eventId"));
				}

				var listRegisteredUser = _context.Reservations.Where(x => x.EventId == id).ToList();
				if(!listRegisteredUser.Any())
				{
					return Ok(new Response(ResponseStatusEnum.Success, "", "No user have registered yet"));
				}

				List<ReservationForAttendanceResDTO> listUser = new List<ReservationForAttendanceResDTO>();
				User user = new User();
				foreach(var reservation in listRegisteredUser)
				{
					user = _context.Users.Where(x => x.Id == reservation.UserId).FirstOrDefault();
					if(user != null)
					{
						var userAttendance = _mapper.Map<ReservationForAttendanceResDTO>(user);
						userAttendance.ReservationId = reservation.Id;
						userAttendance.Attend = reservation.Attend;
						listUser.Add(userAttendance);
					}
				}
				return Ok(new Response(ResponseStatusEnum.Success, listUser));
			}
			catch(Exception ex)
			{
				return BadRequest(new Response(ResponseStatusEnum.Fail, "", ex.Message));
			}
		}

		// DELETE api/Reservations/id
		// Unregister event

		[HttpDelete]
		[CheckUserStatus]
		public async Task<IActionResult> Delete([FromBody] ReservationDTO reservationDTO)
		{
			try
			{
				var id = (int) reservationDTO.EventId;
				var currentUser = await GetCurrentUser(_authManager.GetCurrentEmail(Request));
				if(currentUser == null)
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "Login to continue"));
				}

				var userId = currentUser.Id;
				var events = _context.Events.FirstOrDefault(x => x.Id == id);
				if(events == null)
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "Invalid EventId"));
				}

				var reservation = _context.Reservations.FirstOrDefault(x => x.UserId == userId && x.EventId == id);
				if(reservation == null)
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", "You have not registered this event yet"));
				}

				if(!_repoManager.Event.CanUnregister(id, ReservationValidationInfo.MinHourToUnregister))
				{
					return BadRequest(new Response(ResponseStatusEnum.Fail, "", $"You must unregister for the event {ReservationValidationInfo.MinHourToUnregister} hour before the event starts."));
				}
				_context.Reservations.Remove(reservation);
				_context.SaveChanges();
				return Ok(new Response(ResponseStatusEnum.Success, "", "Unregister successfully"));
			}
			catch(Exception ex)
			{
				return BadRequest(new Response(ResponseStatusEnum.Fail, "", ex.Message));
			}
		}

		[HttpGet("profile/{email}")]
		[CheckUserStatus]
		public async Task<IActionResult> GetProfilePage(string email)
		{
			try
			{
				var user = await _repoManager.User.GetUserAsync(email, false);
				if(user == null)
				{
					return BadRequest(
						new Response(ResponseStatusEnum.Fail, "null", "Can't find the user")
					);
				}
				else
				{
					var userRole = (await _repoManager.UserMeta.GetRolesAsync(user.Email, false)).MetaValue;
					bool isAdmin = userRole.Equals("Admin");
					var profileDTO = new ProfilePageDTO()
					{
						Email = user.Email,
						ImageURL = user.ImageUrl,
						Username = user.UserName,
						Role = userRole,
						OrganizationName = user.OrganizationName.ToString(),
						RegisteredEventsNum = isAdmin ? null : _repoManager.Reservation.GetRegisteredEventsNumOfUser(user.Id),
						ConsecutiveAbsentEventsNum = isAdmin ? null : _repoManager.Reservation.GetConsecutiveAbsentNum(user.Id),
						FeedbackedEventsNum = isAdmin ? null : _repoManager.Reservation.GetRegisteredEventsNumByStatus(user.Id, "Feedbacked"),
						NoFeedbackEventsNum = isAdmin ? null : _repoManager.Reservation.GetRegisteredEventsNumByStatus(user.Id, "Attended"),
						AbsentEventsNum = isAdmin ? null : _repoManager.Reservation.GetRegisteredEventsNumByStatus(user.Id, "Absent"),
						RegisteredPendingEventsNum = isAdmin ? null : _repoManager.Reservation.GetRegisteredEventsNumByStatus(user.Id, "Pending")
					};
					return Ok(
						new Response(
							ResponseStatusEnum.Success,
							new
							{
								UserInfo = profileDTO,
								UserEventInfo = isAdmin ? null : new int[] {
									(int) profileDTO.FeedbackedEventsNum,
									(int) profileDTO.NoFeedbackEventsNum,
									(int) profileDTO.AbsentEventsNum
								}
							},
							"Success!"
						)
					);
				}
			}
			catch(Exception ex)
			{
				return BadRequest(new Response(ResponseStatusEnum.Error, "", ex.Message));
			}
		}

		private Task<User> GetCurrentUser(string email) => _repoManager.User.GetUserAsync(email, false);
	}
}
