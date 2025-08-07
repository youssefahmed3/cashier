using Cashier.Core.Entities;
using Microsoft.EntityFrameworkCore;


namespace Cashier.Infrastructure.Data
{
    public class SubscriptionDbContext(DbContextOptions<SubscriptionDbContext> options) : DbContext(options)
    {
        public DbSet<Subscription> Subscriptions => Set<Subscription>();
    }
}
