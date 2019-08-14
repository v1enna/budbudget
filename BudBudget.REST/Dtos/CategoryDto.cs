using System;

namespace BudBudget.REST.Dtos
{
	public class CategoryDto
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public string Name { get; set; }
		public string Description { get; set; }
	}
}