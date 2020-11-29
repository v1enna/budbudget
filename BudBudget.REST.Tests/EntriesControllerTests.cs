using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using AutoMapper;
using BudBudget.REST.Controllers;
using BudBudget.REST.Dtos;
using BudBudget.REST.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace BudBudget.REST.Tests
{
	public class EntriesControllerTests : BaseControllerTests
	{
		public EntriesControllerTests(DatabaseFixture fixture) : base(fixture)
		{
		}

		private EntriesController CreateEntriesController(BudBudgetContext context, int userId = 0)
		{
			var entriesController = new EntriesController(context, Fixture.mapper);

			var claims = new List<Claim>
			{
				new Claim("UserId", userId.ToString())
			};
			var claimsIdentity = new ClaimsIdentity(claims);
			entriesController.ControllerContext = new ControllerContext();
			entriesController.ControllerContext.HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(claimsIdentity) };

			return entriesController;
		}

		[Fact]
		public async void Can_get_all_current_entries_of_user()
		{
			using (var transaction = Fixture.connection.BeginTransaction())
			{
				using (var context = Fixture.CreateContext(transaction))
				{
					var entriesController = CreateEntriesController(context, 0);
					var userEntries = DatabaseFixture.defaultEntries.Where(e => e.OwnerId == 0);

					var entries = await entriesController.GetEntries(DateTime.MinValue);

					Assert.Equal(Fixture.mapper.ProjectTo<EntryDto>(userEntries.AsQueryable()), entries.Value);
				}
			}
		}
	}
}