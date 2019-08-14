using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using BudBudget.REST.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BudBudget.REST.Authentication
{
	internal class DbSessionHandler : AuthenticationHandler<DbSessionOption>
	{
		private BudBudgetContext dataContext;
		public DbSessionHandler(IOptionsMonitor<DbSessionOption> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock, BudBudgetContext dataContext) : base(options, logger, encoder, clock)
		{
			// store custom services here...
			this.dataContext = dataContext;
		}
		protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
		{
			// Check if trying to authenticate
			string[] authHeader = Context.Request.Headers["Authorization"].ToString().Split("Bearer ");
			if (authHeader.Length < 2)
			{
				return AuthenticateResult.NoResult();
			}

			try
			{
				// Check if session exist
				Guid token = new Guid(authHeader[1]);
				var session = await dataContext.Sessions.SingleOrDefaultAsync(s => s.SID == token);

				if (session != null)
				{
					// Save the user id in the http context of the request
					var claims = new List<Claim>
				{
					new Claim("UserId", session.UserId.ToString())
				};
					var claimsIdentity = new ClaimsIdentity(claims);
					Context.User.AddIdentity(claimsIdentity);

					return AuthenticateResult.Success(new AuthenticationTicket(Context.User, DbSessionOption.AuthenticationScheme));
				}
			}
			catch
			{ }
			return AuthenticateResult.Fail("Session not valid");
		}
	}
}