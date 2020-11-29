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
	public class AuthControllerTests : BaseControllerTests
	{
		public AuthControllerTests(DatabaseFixture fixture) : base(fixture)
		{
		}

		[Fact]
		public async void Can_register_user()
		{
			using (var transaction = Fixture.connection.BeginTransaction())
			{
				using (var context = Fixture.CreateContext(transaction))
				{
					var authController = new AuthController(context, Fixture.mapper);

					var user = new UserDto() { Username = "admin", Password = "admin" };

					// Check for the return value
					var result = await authController.Register(user);
					Assert.Equal("admin", result.Value.Username);
					// Check it doesn't return the password
					Assert.Null(result.Value.Password);

					// Check if it saved the user in the database
					var u = await context.Users.SingleAsync(u => u.Username == "admin");
					Assert.Equal("admin", u.Username);
					Assert.Equal("C7AD44CBAD762A5DA0A452F9E854FDC1E0E7A52A38015F23F3EAB1D80B931DD472634DFAC71CD34EBC35D16AB7FB8A90C81F975113D6C7538DC69DD8DE9077EC", u.PasswordHash);
				}
			}
		}

		[Fact]
		public async void Can_not_register_user_same_username()
		{
			using (var transaction = Fixture.connection.BeginTransaction())
			{
				using (var context = Fixture.CreateContext(transaction))
				{
					var authController = new AuthController(context, Fixture.mapper);

					var user = new UserDto() { Username = "test", Password = "test" };

					var result = await authController.Register(user);

					Assert.IsType<BadRequestObjectResult>(result.Result);
				}
			}
		}

		[Fact]
		public async void Can_login()
		{
			using (var transaction = Fixture.connection.BeginTransaction())
			{
				using (var context = Fixture.CreateContext(transaction))
				{
					var authController = new AuthController(context, Fixture.mapper);

					var user = new UserDto() { Username = "test", Password = "test" };

					var result = await authController.Login(user);

					Assert.NotEqual("", result.Value.SID.ToString());
					var session = context.Sessions.Find(result.Value.SID);
					Assert.Equal(user.Username, session.User.Username);
				}
			}
		}

		[Fact]
		public async void Can_login_fail()
		{
			using (var transaction = Fixture.connection.BeginTransaction())
			{
				using (var context = Fixture.CreateContext(transaction))
				{
					var authController = new AuthController(context, Fixture.mapper);

					var userFailPw = new UserDto() { Username = "test", Password = "1234" };

					var result = await authController.Login(userFailPw);
					Assert.IsType<UnauthorizedResult>(result.Result);

					var userFailUser = new UserDto() { Username = "notExist", Password = "1234" };

					result = await authController.Login(userFailPw);
					Assert.IsType<UnauthorizedResult>(result.Result);
				}
			}
		}

	}
}
