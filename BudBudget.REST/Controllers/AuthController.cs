using System;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BudBudget.REST.Dtos;
using BudBudget.REST.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudBudget.REST.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly BudBudgetContext context;
		private IMapper mapper;

		private string HashPassword(string password)
		{
			StringBuilder stringHash = new StringBuilder();
			using (var hmac = new System.Security.Cryptography.SHA512Managed())
			{
				var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
				for (int i = 0; i < computedHash.Length; i++)
				{
					stringHash.Append(computedHash[i].ToString("X2"));
				}
			}
			return stringHash.ToString(); ;
		}

		public AuthController(BudBudgetContext context, IMapper mapper)
		{
			this.context = context;
			this.mapper = mapper;
		}

		[HttpPost("login")]
		public async Task<ActionResult<SessionDto>> Login([FromBody] UserDto user)
		{
			if (user == null || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
			{
				return BadRequest(new { message = "User not valid." });
			}

			var authUser = await context.Users.SingleOrDefaultAsync(u => (
			u.Username == user.Username && u.PasswordHash == HashPassword(user.Password)));

			if (authUser == null)
			{
				return Unauthorized();
			}

			var session = new Session
			{
				UserId = authUser.Id,
				User = authUser
			};
			await context.Sessions.AddAsync(session);
			await context.SaveChangesAsync();

			return Ok(mapper.Map<SessionDto>(session));
		}

		[HttpPost("register")]
		public async Task<ActionResult<UserDto>> Register([FromBody] UserDto user)
		{
			if (user == null || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
			{
				return BadRequest(new { message = "User not valid." });
			}

			if (await context.Users.SingleOrDefaultAsync(u => u.Username == user.Username) != null)
			{
				return BadRequest(new { message = "User already exist." });
			}

			var newUser = new User
			{
				Username = user.Username,
				PasswordHash = HashPassword(user.Password)
			};
			await context.Users.AddAsync(newUser);
			await context.SaveChangesAsync();

			return Ok(mapper.Map<UserDto>(newUser));
		}
	}
}