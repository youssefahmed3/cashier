using Microsoft.EntityFrameworkCore;
using Order.Core.Entities;

namespace Order.Infrastructure.Data
{
    public class OrderDbContext(DbContextOptions<OrderDbContext> options) : DbContext(options)
    {
       public DbSet<SalesOrder> SalesOrder { get; set; }
       public DbSet<OrderItem> OrderItems { get; set; }

       public DbSet<Refund> Refunds { get; set; }
       public DbSet<RefundItem> RefundItems { get; set; }
       public DbSet<Payment> Payment { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SalesOrder>()
                .HasKey(o => o.Id);
            modelBuilder.Entity<SalesOrder>()
                .Property(o => o.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<OrderItem>()
                .HasKey(oi => oi.Id);
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Payment>()
                .HasKey(o => o.Id);

            modelBuilder.Entity<Payment>()
                .Property(p => p.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<SalesOrder>()
                .HasMany(o => o.Payments)
                .WithOne(p => p.Order)
                .HasForeignKey(p => p.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SalesOrder>().HasQueryFilter(o => !o.IsDeleted);

            modelBuilder.Entity<SalesOrder>()
                .HasMany(o => o.OrderItems)
                .WithOne()
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            //Refund
            modelBuilder.Entity<Refund>()
                .HasKey(r => r.Id);
            modelBuilder.Entity<Refund>()
                .Property(r => r.Id)
                .ValueGeneratedOnAdd();
            modelBuilder.Entity<Refund>()
                .Property(r => r.Amount)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Refund>()
                .Property(r => r.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<RefundItem>()
                .HasKey(ri => ri.Id);
            modelBuilder.Entity<RefundItem>()
                .Property(ri => ri.Id)
                .ValueGeneratedOnAdd();
            modelBuilder.Entity<RefundItem>()
                .Property(ri => ri.UnitPrice)
                .HasPrecision(18, 2);
            modelBuilder.Entity<RefundItem>()
                .Property(ri => ri.Quantity)
                .HasPrecision(18, 2);
            modelBuilder.Entity<RefundItem>()
                .Property(ri => ri.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
            modelBuilder.Entity<RefundItem>()
                .Ignore(ri => ri.TotalPrice);

            modelBuilder.Entity<Refund>()
              .HasMany(r => r.RefundItems)
              .WithOne(ri => ri.Refund)
              .HasForeignKey(ri => ri.RefundId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RefundItem>()
                .HasOne(ri => ri.OrderItem)
                .WithMany()
                .HasForeignKey(ri => ri.OrderItemId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
