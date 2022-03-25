﻿using SEEMS.Data.DTOs;
using SEEMS.Data.Models;
using SEEMS.Models;

namespace SEEMS.Data.Repositories
{
	public interface IReservationRepository
	{
		int GetRegisteredNum(int eventId);
		int GetRegisteredEventsNumOfUser(int userId);
		int GetRegisteredEventsNumByStatus(int userId, string status);
		int GetConsecutiveAbsentNum(int userId);

		public Task<IEnumerable<Reservation>> GetReservationsByEventId(int eventId, bool trackChanges);

		void BulkDeleteReservations(IEnumerable<Reservation> locationIds);

		public Task<IEnumerable<Reservation>> GetReservationsByEventId(DateTime from, bool trackChanges);

		public Task<Reservation> GetReservationAsync(int id, bool trackChanges);
		string GetRegisterEventStatus(int reservationId);
		IEnumerable<RegisteredEventsDTO> GetListRegisteredEvents(int userId);
	}
}
