﻿using AutoMapper;

using SEEMS.Data.DTO;
using SEEMS.Data.DTOs;
using SEEMS.Data.Models;
using SEEMS.DTOs;
using SEEMS.Models;

namespace SEEMS.Configs
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{

			CreateMap<Event, EventDTO>();
			CreateMap<EventDTO, Event>();
			CreateMap<CommentDTO, Comment>();
			CreateMap<Comment, CommentDTO>();
			CreateMap<ChainOfEventForCreationDto, ChainOfEvent>();
			CreateMap<User, User>().ForMember(x => x.Id, opt => opt.Ignore());
		}
	}
}
