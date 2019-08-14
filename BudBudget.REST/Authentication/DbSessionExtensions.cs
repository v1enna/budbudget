using System;
using Microsoft.AspNetCore.Authentication;

namespace BudBudget.REST.Authentication
{
	public static class DbSessionExtensions
	{
		public static AuthenticationBuilder AddDbSession(this AuthenticationBuilder builder, Action<DbSessionOption> configureOptions)
		{
			return builder.AddScheme<DbSessionOption, DbSessionHandler>(DbSessionOption.AuthenticationScheme, DbSessionOption.AuthenticationScheme, configureOptions);
		}
	}
}