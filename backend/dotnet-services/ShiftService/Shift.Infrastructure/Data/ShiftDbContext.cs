using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Shift.Core.Entities;

namespace Shift.Infrastructure.Data
{
    public class ShiftDbContext(DbContextOptions<ShiftDbContext> options) : DbContext(options)
    {
        public DbSet<Core.Entities.Shift> Shifts { get; set; }
        public DbSet<DrawerLog> DrawerLogs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Core.Entities.Shift>(entity =>
            {
                entity.HasKey(s => s.Id);

                entity.Property(s => s.Id)
                      .ValueGeneratedOnAdd();

                entity.Property(s => s.StartingCash)
                      .HasColumnType("decimal(18,2)");

                entity.Property(s => s.EndingCash)
                      .HasColumnType("decimal(18,2)");

                entity.Property(s => s.ExpectedCash)
                      .HasColumnType("decimal(18,2)");

                entity.Property(s => s.CashDifference)
                      .HasColumnType("decimal(18,2)");

                entity.HasMany(s => s.DrawerLogs)
                      .WithOne(d => d.Shift)
                      .HasForeignKey(d => d.ShiftId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DrawerLog>(entity =>
            {
                entity.HasKey(d => d.Id);

                entity.Property(d => d.Id)
                      .ValueGeneratedOnAdd();

                entity.Property(d => d.Amount)
                      .HasColumnType("decimal(18,2)");

            });

        }
    }
}
