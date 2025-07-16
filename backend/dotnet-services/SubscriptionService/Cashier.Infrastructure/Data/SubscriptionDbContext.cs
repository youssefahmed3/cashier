using Microsoft.EntityFrameworkCore;


namespace Cashier.Data
{
    public class SubscriptionDbContext(DbContextOptions<SubscriptionDbContext> options) : DbContext(options)
    {
        public DbSet<Subscription> Subscriptions => Set<Subscription>();
    }
}
