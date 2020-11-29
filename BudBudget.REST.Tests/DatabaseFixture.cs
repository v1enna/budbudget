using System;
using AutoMapper;
using BudBudget.REST.Dtos;
using BudBudget.REST.Models;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BudBudget.REST.Tests
{
	public class DatabaseFixture : IDisposable
	{
		public readonly SqliteConnection connection;
		public DbContextOptions<BudBudgetContext> ContextOptions { get; }
		public IMapper mapper;

		private static readonly object _lock = new object();
		private static bool _databaseInitialized;

		public DatabaseFixture()
		{
			this.connection = new SqliteConnection("DataSource=:memory:");
			this.connection.Open();

			this.ContextOptions = new DbContextOptionsBuilder<BudBudgetContext>()
				.UseSqlite(this.connection)
				.Options;

			Seed();
		}
		private static DateTime oneWeekAgo = DateTime.Now.AddDays(-7);
		public static Category[] defaultCategories = new Category[] {
						new Category() { Id = Guid.NewGuid(), Name = "cat1", Description = "desc1", OwnerId = 1 },
						new Category() { Id = Guid.NewGuid(), Name = "cat2", Description = "desc2", OwnerId = 1 },
						new Category() { Id = Guid.NewGuid(), Name = "cat3", Description = "desc3", OwnerId = 2 }
						};
		public static Entry[] defaultEntries = new Entry[]{
						new Entry() { Id = Guid.NewGuid(), OwnerId = 1, Datetime = DateTime.Now, Name = "entry1", Description = "desc1", Value = -10, Category = defaultCategories[0], SubCategory = defaultCategories[0], CreatedAt = oneWeekAgo, UpdatedAt = oneWeekAgo },
						new Entry() { Id = Guid.NewGuid(), OwnerId = 1, Datetime = DateTime.Now, Name = "entry2", Description = "desc2", Value = (decimal)15.2f, Category =  defaultCategories[0],SubCategory = defaultCategories[0]},
						new Entry() { Id = Guid.NewGuid(), OwnerId = 1, Datetime = DateTime.Now, Name = "entry3", Description = "desc3", Value = 1, Category = defaultCategories[1], SubCategory = defaultCategories[0] },
						new Entry() { Id = Guid.NewGuid(), OwnerId = 1, Datetime = DateTime.Now, Name = "entry4", Description = "deleted entry", Value = 1, Category = defaultCategories[1], SubCategory = defaultCategories[1],Deleted = true },
						new Entry() { Id = Guid.NewGuid(), OwnerId = 2, Datetime = DateTime.Now, Name = "entry5", Description = "desc5", Value = 1, Category = defaultCategories[2],SubCategory = defaultCategories[2] }
						};


		private void Seed()
		{
			lock (_lock)
			{
				if (!_databaseInitialized)
				{
					using (var context = new BudBudgetContext(ContextOptions))
					{
						context.Database.EnsureDeleted();
						context.Database.EnsureCreated();

						// Password: test
						var user1 = new User() { Id = 1, Username = "user", PasswordHash = "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF" };

						// Password: test
						var user2 = new User() { Id = 2, Username = "test", PasswordHash = "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF" };
						context.Add(user1);
						context.Add(user2);

						context.AddRange(defaultCategories);
						context.AddRange(defaultEntries);

						context.SaveChanges();
					}

					_databaseInitialized = true;
				}
			}
		}

		public BudBudgetContext CreateContext(SqliteTransaction transaction = null)
		{
			var config = new MapperConfiguration(cfg =>
				{
					cfg.AddProfile(new AutoMapperProfile());
				});
			this.mapper = config.CreateMapper();

			var context = new BudBudgetContext(ContextOptions);

			if (transaction != null)
			{
				context.Database.UseTransaction(transaction);
			}

			return context;
		}

		public void Dispose()
		{
			this.connection.Close();
		}
	}
}