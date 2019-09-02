# BudBudget

## API server

### Docker deploy

(For development purpose you can use .dev files)

Build the image with

	docker build -f "BudBudget.REST/Dockerfile" -t budbudget.rest BudBudget.REST

To run it you can use docker compose

	docker-compose -f "docker-compose.yml" up

or set manually port 5000 and environment variables.

The production docker-compose file will create a **postgres** server container and launch the **api** server.  
The development docker-compose file will also create a pgadmin container on port 8080. Username aaa@domain.com Password 1234



### Environment variables

You can edit appsettings.json or use these **environment variables**:

* **PGSQL_HOST**: postgres server (default localhost)
* **PGSQL_PORT**: postgres port (default 5432)
* **PGSQL_DATABASE**: postgres database name (default postgres)
* **PGSQL_USERNAME**: postgres username (default postgres)
* **PGSQL_PASSWORD**: postgres password (default password)
* **APPLICATIONURLS**: URLs and ports used by Asp.NET (default http://0.0.0.0:5000)
* **ASPNETCORE_ENVIRONMENT**: Development or Production. Develpoment add debug messages in console and Swagger on the main page