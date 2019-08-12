using System;
using System.ComponentModel.DataAnnotations;

namespace BudBudget.REST.Models
{
	public class Category
	{
		[Key]
		public Guid Id { get; set; }
		[Required]
		public int OwnerId { get; set; }
		public User Owner { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
	}
}