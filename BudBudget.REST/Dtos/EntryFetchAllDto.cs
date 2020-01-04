using System;

namespace BudBudget.REST.Dtos
{
	public class EntryFetchAllDto
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public DateTime Datetime { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public decimal Value { get; set; }
		public CategoryDto Category { get; set; }
		public CategoryDto SubCategory { get; set; }
		public DateTime UpdatedAt { get; set; }
		public bool Deleted { get; set; } = false;
	}
}