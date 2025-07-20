using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Cashier;
using Cashier.Infrastructure.Data;
using Cashier.Services.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddHostedService<ExpiryStatusUpdate>();

builder.Services.AddDbContext<SubscriptionDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
