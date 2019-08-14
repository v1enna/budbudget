using System;
using System.Linq;
using AutoMapper;
using BudBudget.REST.Models;
using Microsoft.AspNetCore.Mvc;

namespace BudBudget.REST.Controllers
{
	public class BaseController : ControllerBase
	{
		protected readonly BudBudgetContext context;

		protected IMapper mapper;

		protected int _userId = -1;
		public int UserId
		{
			get => _userId > 0 ? _userId : Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value);
			set => _userId = value;
		}

		public BaseController(BudBudgetContext context, IMapper mapper)
		{
			this.context = context;
			this.mapper = mapper;
		}
	}
}