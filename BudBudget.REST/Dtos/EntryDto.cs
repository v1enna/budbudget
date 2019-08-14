using System;

namespace BudBudget.REST.Dtos
{
	public class EntryDto
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public DateTime Datetime { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public decimal Value { get; set; }
		public Guid CategoryId { get; set; }
		public Guid SubCategoryId { get; set; }
		public bool Deleted { get; set; } = false;
	}
}