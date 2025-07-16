
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Shift.Infrastructure.Data.Configurations
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

            services.AddDbContext<ShiftDbContext>(options =>
            {
                options.UseSqlServer(connectionString);
            });
        }
    }
}
