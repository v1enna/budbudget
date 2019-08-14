using System;
using System.ComponentModel.DataAnnotations;

namespace BudBudget.REST.Models
{
	public class Session
	{
		[Key]
		public Guid SID { get; set; } = Guid.NewGuid();
		public int UserId { get; set; }
		public User User { get; set; }
	}
}