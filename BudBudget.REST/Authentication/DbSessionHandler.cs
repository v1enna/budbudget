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
			string sidCookie = Context.Request.Cookies["sid"];
			if (authHeader.Length < 2 && sidCookie == "")
			{
				return AuthenticateResult.NoResult();
			}

			string sid = sidCookie != "" ? sidCookie : authHeader[1];

			try
			{
				// Check if session exist
				Guid token = new Guid(sid);
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
					// Don't remove. Needed for correct authentication
					Context.User.AddIdentity(new GenericIdentity("authorized"));

					return AuthenticateResult.Success(new AuthenticationTicket(Context.User, DbSessionOption.AuthenticationScheme));
				}
			}
			catch
			{ }
			return AuthenticateResult.Fail("Session not valid");
		}
	}
}