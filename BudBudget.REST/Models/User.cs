using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BudBudget.REST.Models
{
	public class User
	{
		[Key]
		public int Id { get; set; }
		public string Username { get; set; }
		public string PasswordHash { get; set; }

		public ICollection<Entry> Entries { get; set; }
		public ICollection<Category> Categories { get; set; }
		public ICollection<Session> Sessions { get; set; }
	}
}