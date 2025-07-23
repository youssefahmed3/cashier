
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Order.Infrastructure.Data.Configurations
{
    public static class DbConfiguration
    {
        public static void ConfigureDbService(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("DefaultConnection string is not configured.");
            }

            services.AddDbContext<OrderDbContext>(options =>
            {
                options.UseSqlServer(connectionString);
            });
        }
    }
}
