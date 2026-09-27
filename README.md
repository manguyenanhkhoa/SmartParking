# Smart Parking System

## Stack
- C# / ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- SQL Server
- Swagger
- SignalR
- xUnit

## Team 2 people
- Member 1: Auth + User + Permission + Booking
- Member 2: Parking + Payment + Notification/Dashboard

## Run
```bash
dotnet restore
dotnet build
dotnet run --project src/SmartParking.Api
```

Swagger: `/swagger`
Parking API: `GET /api/parking/slots`
SignalR Hub: `/parkingHub`

## Database
Update `src/SmartParking.Api/appsettings.json` for your SQL Server connection.

## Git branches
- main
- develop
- feature/auth-booking
- feature/parking-payment
