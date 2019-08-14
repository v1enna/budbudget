using System;

namespace BudBudget.REST.Dtos
{
	public class SessionDto
	{
		public Guid SID { get; set; } = Guid.NewGuid();
	}
}