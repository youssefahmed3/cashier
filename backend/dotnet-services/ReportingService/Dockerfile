FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app

COPY Reporting.API.sln ./
COPY Reporting.API/*.csproj Reporting.API/
COPY Reporing.Service/*.csproj Reporing.Service/
COPY Reporting.CORE/*.csproj Reporting.CORE/
COPY Reporting.Shared/*.csproj Reporting.Shared/
COPY Reporting.Infastructure/*.csproj Reporting.Infastructure/

RUN dotnet restore

COPY . ./

EXPOSE 8080
EXPOSE 8081

CMD ["dotnet", "watch", "--project", "Reporting.API/Reporting.API.csproj", "run"]
