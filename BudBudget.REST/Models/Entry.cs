using System;
using System.ComponentModel.DataAnnotations;

namespace BudBudget.REST.Models
{
	public class Entry
	{
		[Key]
		public Guid Id { get; set; } = Guid.NewGuid();
		[Required]
		public int OwnerId { get; set; }
		public User Owner { get; set; }
		[Required]
		public DateTime Datetime { get; set; }
		[Required]
		public string Name { get; set; }
		public string Description { get; set; }
		[Required]
		public decimal Value { get; set; }
		public Guid CategoryId { get; set; }
		public Category Category { get; set; }
		public Guid SubCategoryId { get; set; }
		public Category SubCategory { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
		public bool Deleted { get; set; }
	}
}