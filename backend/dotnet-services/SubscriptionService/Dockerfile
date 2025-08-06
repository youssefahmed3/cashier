FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app

COPY SubscriptionService.sln ./
COPY Cashier.API/*.csproj Cashier.API/
COPY Cashier.Infrastructure/*.csproj Cashier.Infrastructure/
COPY Cashier.Core/*.csproj Cashier.Core/
COPY Cashier.Shared/*.csproj Cashier.Shared/
COPY Services/*.csproj Services/

RUN dotnet restore

COPY . ./

EXPOSE 8080
EXPOSE 8081

CMD ["dotnet", "watch", "--project", "Cashier.API/Cashier.API.csproj", "run"]
