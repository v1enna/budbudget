using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using BudBudget.REST.Dtos;
using BudBudget.REST.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudBudget.REST.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class EntriesController : ControllerBase
	{
		private readonly BudBudgetContext context;

		private IMapper mapper;

		public EntriesController(BudBudgetContext context, IMapper mapper)
		{
			this.context = context;
			this.mapper = mapper;
		}

		/// <summary>
		/// Get all the entries.
		/// </summary>
		/// <returns></returns>
		[HttpGet]
		public async Task<ActionResult<IEnumerable<EntryDto>>> GetEntries()
		{
			Console.WriteLine("Sei l'utente con ID: " + HttpContext.User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value);
			return Ok(await context.Entries.ProjectTo<EntryDto>(mapper.ConfigurationProvider).ToListAsync());
		}

		/// <summary>
		/// Get a single entry.
		/// </summary>
		/// <param name="id">The GUID of the entry.</param>
		/// <returns>A single entry.</returns>
		[HttpGet("{id}")]
		public async Task<ActionResult<EntryDto>> GetEntry(Guid id)
		{
			var e = await context.Entries
				.ProjectTo<EntryDto>(mapper.ConfigurationProvider)
				.SingleAsync(entry => entry.Id == id);
			// .FindAsync(id);
			if (e == null)
			{
				return NotFound();
			}
			return Ok(e);
		}

		// POST api/values
		[HttpPost]
		public async Task<ActionResult<Entry>> PostEntry([FromBody] EntryDto entry)
		{
			context.Entries.Add(mapper.Map<Entry>(entry));
			await context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetEntry), new { id = entry.Id }, entry);
		}

		// PUT api/values/5
		[HttpPut("{id}")]
		public void Put(int id, [FromBody] string value)
		{
		}

		// DELETE api/values/5
		[HttpDelete("{id}")]
		public void Delete(int id)
		{
		}
	}
}
