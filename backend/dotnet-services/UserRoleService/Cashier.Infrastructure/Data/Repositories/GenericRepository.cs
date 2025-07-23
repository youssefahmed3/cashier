namespace Cashier.Infrastructure.Data.Repositories
{
    public class GenericRepository<TEntity, TKey> : IGenericRepository<TEntity, TKey> where TEntity : class
    {
        private readonly DbContext _dbContext;

        private readonly DbSet<TEntity> _dbSet;
        public GenericRepository(DbContext dbcontext)
        {
            _dbContext = dbcontext;
            _dbSet = dbcontext.Set<TEntity>();
        }
        public async Task AddAsync(TEntity entity) => await _dbContext.Set<TEntity>().AddAsync(entity);

        public async Task AddRangeAsync(IEnumerable<TEntity> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }

        public void Delete(TEntity entity) => _dbContext.Set<TEntity>().Remove(entity);

        public void DeleteRange(IEnumerable<TEntity> entities)
        {
            _dbSet.RemoveRange(entities);
        }
        public async Task<IEnumerable<TEntity>> GetAllAsync(bool asNoTracking = false) =>
            asNoTracking ?
            await _dbContext.Set<TEntity>().ToListAsync() :
            await _dbContext.Set<TEntity>().AsNoTracking().ToListAsync();

        public async Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }
        public async Task<TEntity?> GetByIdAsync(TKey id) => await _dbContext.Set<TEntity>().FindAsync(id);
        public void Update(TEntity entity) => _dbContext.Update(entity);
    }
}