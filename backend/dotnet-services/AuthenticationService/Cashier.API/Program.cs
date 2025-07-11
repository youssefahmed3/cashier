
namespace Cashier.API
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Cashier API",
                    Version = "v1"
                });
            });

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();
            builder.Services.AddDbContext<CashierDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });
            builder.Services.AddTransient<IEmailSender, EmailSender>();
            builder.Services.AddIdentity<AppUser, AppRole>(options =>
            {
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;
                options.User.RequireUniqueEmail = true;
            }).AddEntityFrameworkStores<CashierDbContext>().AddDefaultTokenProviders();
            //.AddUserManager<AppUser>().AddRoleManager<AppRole>();
            builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("JWTOptions"));

            var jwtOptions = builder.Configuration.GetSection("JWTOptions").Get<JwtOptions>();
            builder.Services.AddSingleton<TokenValidationParameters>(new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtOptions!.Issuer,
                ValidAudience = jwtOptions.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey))
            });
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions!.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey))
                };
            });
            builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
            builder.Services.AddAuthorization();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("MyPolicy", policyOptioons =>
                {
                    policyOptioons.AllowAnyHeader().AllowAnyMethod().WithOrigins(builder.Configuration["FrontBaseUrl"]!);
                });
            });
            builder.Services.AddAutoMapper((typeof(MappingProfile)));
            builder.Services.AddMemoryCache();

            var app = builder.Build();
            //Ask CLR for creating object from DBContext explicitly
            using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;
            var _dbContext = services.GetRequiredService<CashierDbContext>();
            var loggerFactory = services.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger<Program>();
            if (_dbContext.Database.GetPendingMigrations().Any())
            {
                try
                {
                    await _dbContext.Database.MigrateAsync();
                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
                    await CashierContextSeed.SeedDataAsync(userManager, roleManager, _dbContext);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error has been occured during applying the migration");
                }
            }
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Cashier API V1");
                    options.RoutePrefix = string.Empty; 
                });
            }

            app.UseHttpsRedirection();
            app.UseCors("MyPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
