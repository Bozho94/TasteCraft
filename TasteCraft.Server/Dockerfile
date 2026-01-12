# ===== BUILD STAGE =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY TasteCraft.Server/*.csproj TasteCraft.Server/
RUN dotnet restore TasteCraft.Server/TasteCraft.Server.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish TasteCraft.Server/TasteCraft.Server.csproj -c Release -o /app/publish /p:UseAppHost=false

# ===== RUNTIME STAGE =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TasteCraft.Server.dll"]
