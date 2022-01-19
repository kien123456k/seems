﻿using AutoMapper;
using SEEMS.Data.DTO;
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
            CreateMap<CommentDto, Comment>();
        }
    }
}