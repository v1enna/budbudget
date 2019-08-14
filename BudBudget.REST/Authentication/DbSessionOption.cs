using Microsoft.AspNetCore.Authentication;
namespace BudBudget.REST.Authentication
{
	public class DbSessionOption : AuthenticationSchemeOptions
	{
		public const string AuthenticationScheme = "Bearer";
		public DbSessionOption()
		{

		}
	}
}