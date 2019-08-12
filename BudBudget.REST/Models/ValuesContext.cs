using Microsoft.EntityFrameworkCore;

namespace BudBudget.REST.Models
{
	public class ValuesContext : DbContext
	{
		public ValuesContext(DbContextOptions<ValuesContext> options)
			: base(options)
		{ }
		public DbSet<Values> values { get; set; }
	}
}