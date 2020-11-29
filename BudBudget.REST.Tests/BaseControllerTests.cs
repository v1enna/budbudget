using Xunit;

namespace BudBudget.REST.Tests
{
	[CollectionDefinition("Database collection")]
	public class DatabaseCollection : ICollectionFixture<DatabaseFixture>
	{
		// This class has no code, and is never created. Its purpose is simply
		// to be the place to apply [CollectionDefinition] and all the
		// ICollectionFixture<> interfaces.
	}

	[Collection("Database collection")]
	public class BaseControllerTests
	{
		public DatabaseFixture Fixture { get; }

		public BaseControllerTests(DatabaseFixture fixture)
		{
			this.Fixture = fixture;
		}

	}
}