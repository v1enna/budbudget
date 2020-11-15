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
	public class CategoriesController : BaseController
	{
		public CategoriesController(BudBudgetContext context, IMapper mapper) : base(context, mapper)
		{ }

		/// <summary>
		/// Get all the categories of the user
		/// </summary>
		/// <returns></returns>
		[HttpGet]
		public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
		{
			return await context.Categories
				.Where(c => c.OwnerId == this.UserId)
				.ProjectTo<CategoryDto>(mapper.ConfigurationProvider)
				.ToListAsync();
		}

		/// <summary>
		/// Get a single category.
		/// </summary>
		/// <param name="id">The GUID of the category.</param>
		/// <returns>A single caregory.</returns>
		[HttpGet("{id}")]
		public async Task<ActionResult<CategoryDto>> GetCategory(Guid id)
		{
			var category = await context.Categories
				.SingleOrDefaultAsync(c => c.Id == id && c.OwnerId == this.UserId);

			if (category == null)
			{
				return NotFound();
			}
			return mapper.Map<CategoryDto>(category);
		}

		/// <summary>
		/// Create a new category.
		/// If the id of the category already exist it will return 404.
		/// If no id is passed it will generate one.
		/// </summary>
		/// <param name="category"></param>
		/// <returns></returns>
		[HttpPost]
		public async Task<ActionResult<CategoryDto>> PostEntry([FromBody] CategoryDto category)
		{
			Category newCategory = mapper.Map<Category>(category);
			newCategory.OwnerId = this.UserId;
			if (newCategory.Id == null) newCategory.Id = Guid.NewGuid();
			context.Categories.Add(newCategory);
			try
			{
				await context.SaveChangesAsync();
			}
			catch
			{
				return BadRequest();
			}

			return CreatedAtAction(nameof(GetCategory), new { id = newCategory.Id }
				, mapper.Map<CategoryDto>(newCategory));
		}

		/// <summary>
		/// Update a category.
		/// Require a full object or will insert null.
		/// </summary>
		/// <param name="category"></param>
		[HttpPut]
		public async Task<ActionResult<CategoryDto>> UpdateCategory([FromBody] CategoryDto category)
		{
			Category existingCategory = await context.Categories.FindAsync(category.Id);

			if (existingCategory == null)
			{
				return BadRequest();
			}
			if (existingCategory.OwnerId != this.UserId)
			{
				return Forbid();
			}

			Category newCategory = mapper.Map(category, existingCategory);

			context.Categories.Update(newCategory);
			await context.SaveChangesAsync();

			return mapper.Map<CategoryDto>(newCategory);
		}

		/// <summary>
		/// Delete a category.
		/// </summary>
		/// <param name="id"></param>
		/// <returns>Return the deleted category.</returns>
		[HttpDelete("{id}")]
		public async Task<ActionResult<CategoryDto>> Delete(Guid id)
		{
			Category category = await context.Categories.FindAsync(id);

			if (category == null)
			{
				return BadRequest();
			}
			if (category.OwnerId != this.UserId)
			{
				return Forbid();
			}

			context.Categories.Remove(category);
			await context.SaveChangesAsync();

			return mapper.Map<CategoryDto>(category);
		}
	}
}