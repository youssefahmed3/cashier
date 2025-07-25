﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;

namespace Order.Core.Interfaces.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
         IOrderRepository Orders { get; }
        IGenericRepository<OrderItem, long> OrderItems { get; }

        IPaymentRepository PaymentRepo { get; }
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
