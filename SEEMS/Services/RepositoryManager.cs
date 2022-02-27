﻿using SEEMS.Contexts;
using SEEMS.Data.Repositories;
using SEEMS.Data.Repositories.Implements;
using SEEMS.Services.Interfaces;

namespace SEEMS.Services
{
    public class RepositoryManager : IRepositoryManager
    {

		private ApplicationDbContext _context;
		private IUserRepository _userRepository;
		private IUserMetaRepository _userMetaRepository;
		private IChainOfEventsRepository _chainOfEventsRepository;
		private IOrganizationRepository _organizationRepository;
		private IEventRepository _eventRepository;
		private ICommentRepository _commentRepository;

		public RepositoryManager( ApplicationDbContext context )
		{
			_context = context;
		}

        public IUserRepository User 
        { 
            get
            {
                if (_userRepository == null)
                {
                    _userRepository = new UserRepository(_context);
                }

                return _userRepository; 
            } 
        }

        public IUserMetaRepository UserMeta
        {
            get
            {
                if (_userMetaRepository == null)
                {
                    _userMetaRepository = new UserMetaRepository(_context);
                }

                return _userMetaRepository;
            }
        }

        public IChainOfEventsRepository ChainOfEvent
        {
            get
            {
                if (_chainOfEventsRepository == null)
                {
                    _chainOfEventsRepository = new ChainOfEventRepository(_context);
                }

                return _chainOfEventsRepository;
            }
        }

        public IOrganizationRepository Organization
        {
            get
            {
                if (_organizationRepository == null)
                {
                    _organizationRepository = new OrganizationRepository(_context);
                }
                return _organizationRepository;
            }
        }

		public IEventRepository Event
		{
			get
			{
				if (_eventRepository == null)
				{
					_eventRepository = new EventRepository(_context);
				}
				return _eventRepository;
			}
		}

		public ICommentRepository Comment
		{
			get
			{
				if (_commentRepository == null)
				{
					_commentRepository = new CommentRepository(_context);
				}
				return _commentRepository;
			}
		}

		private void RegisterRepositories()
		{

		}

        public Task SaveAsync() => _context.SaveChangesAsync(); 
    }
}
