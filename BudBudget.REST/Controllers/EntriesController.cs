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
	public class EntriesController : BaseController
	{

		public EntriesController(BudBudgetContext context, IMapper mapper)
			: base(context, mapper)
		{ }

		/// <summary>
		/// Get all the entries of the authenticated user.
		/// </summary>
		/// <param name="lastUpdatedAt">Get entries from this date.</param>
		/// <param name="deleted">If true get also the deleted entries. DEFAULT: false</param>
		/// <returns></returns>
		[HttpGet]
		public async Task<ActionResult<IEnumerable<EntryDto>>> GetEntries(DateTime lastUpdatedAt, bool deleted = false)
		{

			return Ok(await context.Entries
				.Where(e =>
					e.OwnerId == this.UserId &&
					(deleted ? true : !e.Deleted) &&
					e.UpdatedAt > lastUpdatedAt
				)
				.ProjectTo<EntryDto>(mapper.ConfigurationProvider)
				.ToListAsync());
		}

		/// <summary>
		/// Get a single entry.
		/// </summary>
		/// <param name="id">The GUID of the entry.</param>
		/// <returns>A single entry.</returns>
		[HttpGet("{id}")]
		public async Task<ActionResult<EntryDto>> GetEntry(Guid id)
		{
			var entry = await context.Entries
				.SingleOrDefaultAsync(e => e.Id == id && e.OwnerId == this.UserId);

			if (entry == null)
			{
				return NotFound();
			}
			return Ok(mapper.Map<EntryDto>(entry));
		}

		/// <summary>
		/// Create a new Entry.
		/// If the id of the entry already exist it will return 404.
		/// If no id is passed it will generate one.
		/// </summary>
		/// <param name="entry"></param>
		/// <returns></returns>
		[HttpPost]
		public async Task<ActionResult<EntryDto>> PostEntry([FromBody] EntryDto entry)
		{
			Entry newEntry = mapper.Map<Entry>(entry);
			newEntry.OwnerId = this.UserId;
			if (newEntry.Id == null) newEntry.Id = Guid.NewGuid();
			context.Entries.Add(newEntry);
			try
			{
				await context.SaveChangesAsync();
			}
			catch
			{
				return BadRequest();
			}

			return CreatedAtAction(nameof(GetEntry), new { id = newEntry.Id }
				, mapper.Map<EntryDto>(newEntry));
		}

		/// <summary>
		/// Update an entry.
		/// Require a full object or will insert null.
		/// </summary>
		/// <param name="entry"></param>
		[HttpPut]
		public async Task<ActionResult<EntryDto>> UpdateEntry([FromBody] EntryDto entry)
		{
			Entry existingEntry = await context.Entries.FindAsync(entry.Id);

			if (existingEntry == null)
			{
				return BadRequest();
			}
			if (existingEntry.OwnerId != this.UserId)
			{
				return Forbid();
			}

			Entry newEntry = mapper.Map(entry, existingEntry);
			newEntry.UpdatedAt = DateTime.UtcNow;

			context.Entries.Update(newEntry);
			await context.SaveChangesAsync();

			return Ok(mapper.Map<EntryDto>(newEntry));
		}

		/// <summary>
		/// Delete an entry.
		/// </summary>
		/// <param name="id"></param>
		/// <returns>Return the deleted entry.</returns>
		[HttpDelete("{id}")]
		public async Task<ActionResult<EntryDto>> Delete(Guid id)
		{
			Entry entry = await context.Entries.FindAsync(id);

			if (entry == null)
			{
				return BadRequest();
			}
			if (entry.OwnerId != this.UserId)
			{
				return Forbid();
			}

			entry.Deleted = true;

			context.Entries.Update(entry);
			await context.SaveChangesAsync();

			return Ok(mapper.Map<EntryDto>(entry));
		}
	}
}
