using System;
using AutoMapper;
using BudBudget.REST.Controllers;
using BudBudget.REST.Dtos;
using BudBudget.REST.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BudBudget.REST.Tests
{
	public class TestControllers : IDisposable
	{
		private readonly SqliteConnection connection;
		protected DbContextOptions<BudBudgetContext> ContextOptions { get; }
		protected IMapper mapper;

		private void Seed()
		{
			using (var context = new BudBudgetContext(ContextOptions))
			{
				context.Database.EnsureDeleted();
				context.Database.EnsureCreated();

				// Password: admin
				// var user1 = new User() { Username = "admin", PasswordHash = "c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec" };

				// // Password: test
				// var user2 = new User() { Username = "test", PasswordHash = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff" };

				// context.AddRange(user1, user2);

				// context.SaveChanges();
			}
		}

		private BudBudgetContext CreateContext(SqliteTransaction transaction = null)
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

		public TestControllers()
		{
			this.connection = new SqliteConnection("DataSource=:memory:");
			this.connection.Open();

			this.ContextOptions = new DbContextOptionsBuilder<BudBudgetContext>()
				.UseSqlite(this.connection)
				.Options;

			this.Seed();
		}

		[Fact]
		public void Can_register_user()
		{
			using (var transaction = this.connection.BeginTransaction())
			{
				using (var context = this.CreateContext(transaction))
				{
					var authController = new AuthController(context, this.mapper);

					var user = new UserDto() { Username = "admin", Password = "admin" };

					var result = authController.Register(user).Result;

					Assert.Equal("admin", result.Value.Username);
				}
			}
		}

		[Fact]
		public void Can_not_register_user_already_existing()
		{
			using (var transaction = this.connection.BeginTransaction())
			{
				using (var context = this.CreateContext(transaction))
				{
					var authController = new AuthController(context, this.mapper);

					var user = new UserDto() { Username = "admin", Password = "admin" };

					authController.Register(user);

					var result = authController.Register(user).Result;

					Assert.IsType<BadRequestObjectResult>(result.Result);
				}
			}
		}

		[Fact]
		public void Can_login()
		{
			using (var transaction = this.connection.BeginTransaction())
			{
				using (var context = this.CreateContext(transaction))
				{
					var authController = new AuthController(context, this.mapper);

					var user = new UserDto() { Username = "admin", Password = "admin" };

					authController.Register(user);

					var result = authController.Login(user).Result;

					Assert.NotEqual("", result.Value.SID.ToString());
				}
			}
		}

		[Fact]
		public void Can_login_fail()
		{
			using (var transaction = this.connection.BeginTransaction())
			{
				using (var context = this.CreateContext(transaction))
				{
					var authController = new AuthController(context, this.mapper);

					var user = new UserDto() { Username = "admin", Password = "admin" };

					authController.Register(user);

					var userFailPw = new UserDto() { Username = "admin", Password = "1234" };

					var result = authController.Login(userFailPw).Result;
					Assert.IsType<UnauthorizedResult>(result.Result);

					var userFailUser = new UserDto() { Username = "notExist", Password = "1234" };

					result = authController.Login(userFailPw).Result;
					Assert.IsType<UnauthorizedResult>(result.Result);
				}
			}
		}

		public void Dispose()
		{
			this.connection.Close();
		}
	}
}
