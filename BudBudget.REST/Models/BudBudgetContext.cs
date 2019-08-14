using System;
using Microsoft.EntityFrameworkCore;

namespace BudBudget.REST.Models
{
	public class BudBudgetContext : DbContext
	{
		public BudBudgetContext(DbContextOptions<BudBudgetContext> options)
			: base(options)
		{ }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Entry>(entry =>
			{
				entry.Property(e => e.CreatedAt)
					.HasDefaultValueSql("CURRENT_TIMESTAMP");
				entry.Property(e => e.UpdatedAt)
					.HasDefaultValueSql("CURRENT_TIMESTAMP");
				entry.Property(e => e.Deleted)
					.HasDefaultValue(false);
				entry.Property(e => e.Deleted)
					.HasDefaultValue(false);
			});

			modelBuilder.Entity<User>()
				.HasAlternateKey(u => u.Username)
				.HasName("AK_Username");
		}

		public DbSet<Entry> Entries { get; set; }
		public DbSet<User> Users { get; set; }
		public DbSet<Category> Categories { get; set; }
		public DbSet<Session> Sessions { get; set; }
	}
}