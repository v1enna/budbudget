using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudBudget.REST.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudBudget.REST.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BudBudgetController : ControllerBase
	{
		private readonly BudBudgetContext context;

		public BudBudgetController(BudBudgetContext context)
		{
			this.context = context;
		}

		/// <summary>
		/// Get all the entries.
		/// </summary>
		/// <returns></returns>
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Entry>>> GetEntries()
		{
			return Ok(await context.Entries.ToListAsync());
		}

		/// <summary>
		/// Get a single entry.
		/// </summary>
		/// <param name="id">The GUID of the entry.</param>
		/// <returns>A single entry.</returns>
		[HttpGet("{id}")]
		public async Task<ActionResult<Entry>> GetEntry(Guid id)
		{
			var e = await context.Entries
				.Include(entry => entry.Owner)
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
		public async Task<ActionResult<Entry>> PostEntry([FromBody] Entry entry)
		{
			context.Entries.Add(entry);
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
