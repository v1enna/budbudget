FROM mcr.microsoft.com/dotnet/core/runtime:2.2 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build
WORKDIR /src
COPY ["BudBudget.REST.csproj", "./"]
RUN dotnet restore "./BudBudget.REST.csproj"
COPY . .
WORKDIR /src/.
RUN dotnet build "BudBudget.REST.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "BudBudget.REST.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "BudBudget.REST.dll"]
