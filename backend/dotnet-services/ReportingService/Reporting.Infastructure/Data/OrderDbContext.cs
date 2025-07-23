using Microsoft.EntityFrameworkCore;
using Reporting.Core.Entities;


namespace Reporting.Infrastructure.Data
{
    public class OrderDbContext(DbContextOptions<OrderDbContext> options) : DbContext(options)
    {
        public DbSet<Order> Orders => Set<Order>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>().HasData(
                new Order
                {
                    Id = 1,
                    CreatedAt = DateTime.Parse("2025-07-20T14:30:00"),
                    UpdatedAt = DateTime.Parse("2025-07-21T09:15:00"),
                    Status = "Completed",
                    Total = 250
                },
                new Order
                {
                    Id = 2,
                    CreatedAt = DateTime.Parse("2025-07-21T12:45:00"),
                    UpdatedAt = null,
                    Status = "Pending",
                    Total = 180
                },
                new Order
                {
                    Id = 3,
                    CreatedAt = DateTime.Parse("2025-07-22T08:20:00"),
                    UpdatedAt = DateTime.Parse("2025-07-22T10:00:00"),
                    Status = "Cancelled",
                    Total = 0
                },
                new Order
                {
                    Id = 4,
                    CreatedAt = DateTime.Parse("2025-07-22T15:10:00"),
                    UpdatedAt = DateTime.Parse("2025-07-22T16:45:00"),
                    Status = "Completed",
                    Total = 320
                },
                new Order
                {
                    Id = 5,
                    CreatedAt = DateTime.Parse("2025-07-23T09:00:00"),
                    UpdatedAt = null,
                    Status = "Processing",
                    Total = 210
                }
            );
        }

    }
}
