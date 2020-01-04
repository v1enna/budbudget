using AutoMapper;
using BudBudget.REST.Models;

namespace BudBudget.REST.Dtos
{
	public class AutoMapperProfile : Profile
	{
		public AutoMapperProfile()
		{
			CreateMap<User, UserDto>();
			CreateMap<UserDto, User>();
			CreateMap<Session, SessionDto>();
			CreateMap<SessionDto, Session>();
			CreateMap<Entry, EntryDto>();
			CreateMap<EntryDto, Entry>();
			CreateMap<EntryFetchAllDto, Entry>();
			CreateMap<Entry, EntryFetchAllDto>();
			CreateMap<Category, CategoryDto>();
			CreateMap<CategoryDto, Category>();
		}
	}
}