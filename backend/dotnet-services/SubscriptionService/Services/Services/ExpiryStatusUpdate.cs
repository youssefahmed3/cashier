using Cashier.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Cashier.Services.Services
{
    public class ExpiryStatusUpdate : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        public ExpiryStatusUpdate(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<SubscriptionDbContext>();
                    var subscriptions = await dbContext.Subscriptions.ToListAsync(stoppingToken);
                    foreach (var subscription in subscriptions)
                    {
                        if (subscription.ExpireDate < DateTime.UtcNow && subscription.IsActive)
                        {
                            subscription.IsActive = false;
                        }
                    }
                    await dbContext.SaveChangesAsync(stoppingToken);
                }
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }
    }
}
