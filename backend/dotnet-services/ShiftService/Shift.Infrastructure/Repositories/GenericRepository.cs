using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Shift.Core.Interfaces.Repositories;
using Shift.Infrastructure.Data;

namespace Shift.Infrastructure.Repositories
{
    public class GenericRepository<TEntity, TKey> : IGenericRepository<TEntity, TKey> where TEntity : class
    {
        protected readonly ShiftDbContext _dbContext;
        protected readonly DbSet<TEntity> _dbSet;

        public GenericRepository(ShiftDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = dbContext.Set<TEntity>();
        }

        public async Task AddAsync(TEntity entity) => await _dbContext.AddAsync(entity);

        public void Delete(TEntity entity) => _dbSet.Remove(entity);
       
        public async Task<TEntity?> GetByIdAsync(TKey id) => await _dbSet.FindAsync(id);

        public void Update(TEntity entity) => _dbSet.Update(entity);

        public async Task<IEnumerable<TEntity>> GetAllAsync(bool asNoTracking = false)
        {
            var query = asNoTracking ? _dbSet.AsNoTracking() : _dbSet;
            return await query.ToListAsync();
        }

    }
}
