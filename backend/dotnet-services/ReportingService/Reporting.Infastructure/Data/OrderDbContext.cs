using Microsoft.EntityFrameworkCore;
using Reporting.Core.Entities;


namespace Reporting.Infrastructure.Data
{
    public class OrderDbContext(DbContextOptions<OrderDbContext> options) : DbContext(options)
    {
        public DbSet<Order> Orders => Set<Order>();
    }
}
