using Microsoft.EntityFrameworkCore;
using Reporting.Core.Entities;


namespace Reporting.Infrastructure.Data
{
    public class OrderDbContext(DbContextOptions<OrderDbContext> options) : DbContext(options)
    {
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<Tenant> Tenants => Set<Tenant>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>().HasData(
                new Order
                {
                    Id = 1,
                    CreatedAt = DateTime.Parse("2025-03-20T14:30:00"),
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
                    CreatedAt = DateTime.Parse("2025-05-22T08:20:00"),
                    UpdatedAt = DateTime.Parse("2025-07-22T10:00:00"),
                    Status = "Cancelled",
                    Total = 0
                },
                new Order
                {
                    Id = 4,
                    CreatedAt = DateTime.Parse("2024-07-22T15:10:00"),
                    UpdatedAt = DateTime.Parse("2024-07-22T16:45:00"),
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

            modelBuilder.Entity<Tenant>().HasData(
                new Tenant
                {
                    Id = Guid.Parse("8a6a7df2-12a1-4c38-b43e-7b97b1a2c9e5"),
                    Name = "Cafe Bliss",
                    Logo = "cafebliss-logo.png",
                    CreatedAt = new DateTime(2024, 11, 10, 9, 45, 0),
                    IsActive = true
                },
                new Tenant
                {
                    Id = Guid.Parse("1fbb3e8e-a31b-47ec-89c0-83f617d2ab31"),
                    Name = "Green Grocers",
                    Logo = "greengrocers-logo.svg",
                    CreatedAt = new DateTime(2023, 4, 22, 13, 20, 0),
                    IsActive = false
                },
                new Tenant
                {
                    Id = Guid.Parse("7fdc6bd0-7a39-4d5b-8b9f-7332d3eacc2f"),
                    Name = "Tech Bazaar",
                    Logo = "techbazaar.png",
                    CreatedAt = new DateTime(2025, 1, 15, 11, 30, 0),
                    IsActive = true
                },
                new Tenant
                {
                    Id = Guid.Parse("ea1b788c-bb89-4201-82fc-1262b17b0ae6"),
                    Name = "Book Nest",
                    Logo = "booknest.jpg",
                    CreatedAt = new DateTime(2022, 8, 1, 17, 10, 0),
                    IsActive = true
                },
                new Tenant
                {
                    Id = Guid.Parse("c90db1e7-2ec6-447f-a149-9db97ce5e389"),
                    Name = "Urban Style",
                    Logo = "urbanstyle-logo.webp",
                    CreatedAt = new DateTime(2025, 6, 5, 8, 0, 0),
                    IsActive = false
                }
            );

        }




    }
}
