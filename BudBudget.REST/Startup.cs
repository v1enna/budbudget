using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudBudget.REST.Authentication;
using BudBudget.REST.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using AutoMapper;
using BudBudget.REST.Dtos;

namespace BudBudget.REST
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
				.AddJsonOptions( // To solve reference looping in the models
					options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
			);

			services.AddAuthentication(x =>
			{
				x.DefaultAuthenticateScheme = DbSessionOption.AuthenticationScheme;
				x.DefaultChallengeScheme = DbSessionOption.AuthenticationScheme;
			}).AddDbSession(o => { });

			services.AddAutoMapper(typeof(AutoMapperProfile));

			// Swagger
			services.AddSwaggerGen(options =>
			{
				options.SwaggerDoc("v1", new OpenApiInfo { Title = "BudBudget API", Version = "v1" });
			});

			// Database configuration
			var pgsqlConfiguration = Configuration.GetSection("PGSQL");
			string host = Environment.GetEnvironmentVariable("PGSQL_HOST") ?? pgsqlConfiguration?["host"];
			string port = Environment.GetEnvironmentVariable("PGSQL_PORT") ?? pgsqlConfiguration?["port"];
			string database = Environment.GetEnvironmentVariable("PGSQL_DATABASE") ?? pgsqlConfiguration?["database"];
			string username = Environment.GetEnvironmentVariable("PGSQL_USERNAME") ?? pgsqlConfiguration?["username"];
			string password = Environment.GetEnvironmentVariable("PGSQL_PASSWORD") ?? pgsqlConfiguration?["password"];

			string connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password}";

			services.AddDbContext<BudBudgetContext>(options => options.UseNpgsql(connectionString));
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();

				app.UseSwagger();
				app.UseSwaggerUI(c =>
				{
					c.SwaggerEndpoint("/swagger/v1/swagger.json", "BudBudget API");
					c.RoutePrefix = string.Empty;
				});
			}
			else
			{
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}
			app.UseCors(builder =>
				builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

			app.UseAuthentication();
			// app.UseHttpsRedirection();
			app.UseMvc();
		}
	}
}
