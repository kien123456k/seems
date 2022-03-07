﻿using SEEMS.Infrastructures.Commons;

using System.ComponentModel.DataAnnotations;

namespace SEEMS.Data.DTO
{
	public class EventDTO
	{
		public int? Id { get; set; }
		[Required]
		public string EventTitle { get; set; }
		[Required]
		public string EventDescription { get; set; }
		public int? CommentsNum { get; set; }
		public int? RootCommentsNum { get; set; }
		[Required(ErrorMessage = "Participant num is required")]
		public int ParticipantNum { get; set; }
		public OrganizationEnum? OrganizationEnum { get; set; }
		public int? ChainOfEventId { get; set; }
		[Required]
		public bool IsPrivate { get; set; }
		[Required]
		public string ImageUrl { get; set; }
		[Required]
		public bool Active { get; set; }
		[Required]
		public string Location { get; set; }
		[Required]
		public DateTime StartDate { get; set; }
		[Required]
		public DateTime EndDate { get; set; }
		public DateTime? RegistrationDeadline { get; set; }
	}
}
