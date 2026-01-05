using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TasteCraft.Server.Data;
using TasteCraft.Server.Services;
using TasteCraft.Server.Services.Contracts;

namespace TasteCraft.Server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

            builder.Services.AddDbContext<TasteCraftDbContext>(options =>
                options.UseNpgsql(connectionString));

            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IProductService, ProductService>();
            builder.Services.AddScoped<IOrderService, OrderService>();

            builder.Services.AddDefaultIdentity<IdentityUser>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.User.RequireUniqueEmail = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireDigit = false;

            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<TasteCraftDbContext>();

            builder.Services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Name = ".TasteCraft.Auth";              // ясно име
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.None;           // да се праща cross-site
                options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                // за да може и на http://localhost при dev (ако има някъде http)

                options.LoginPath = "/Identity/Account/Login";         // казваме КЪДЕ е login
                options.AccessDeniedPath = "/Identity/Account/AccessDenied";
            });



            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddRazorPages();
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("_myAllowSpecificOrigins", policy =>
                {
                    policy
                        .SetIsOriginAllowed(origin =>
                        {
                            // позволява всички http://localhost:XXXX
                            var uri = new Uri(origin);
                            return uri.Host == "localhost";
                        })
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });


            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors(MyAllowSpecificOrigins);

            app.UseAuthentication(); 
            app.UseAuthorization();

            app.MapControllers();
            app.MapRazorPages();

            app.MapFallbackToFile("/index.html");

          /*  async Task SeedAdminAsync(WebApplication app)
            {
                using var scope = app.Services.CreateScope();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

                const string adminRole = "Admin";
                if (!await roleManager.RoleExistsAsync(adminRole))
                    await roleManager.CreateAsync(new IdentityRole(adminRole));

                var adminEmail = config["Admin:Email"];
                var adminPassword = config["Admin:Password"];

                if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
                {
                    throw new InvalidOperationException("Admin credentials are not configured. Please set Admin:Email and Admin:Password in user-secrets or environment variables.");
                }

                var user = await userManager.FindByEmailAsync(adminEmail);
                if (user == null)
                {
                    user = new IdentityUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
                    var create = await userManager.CreateAsync(user, adminPassword);
                    if (!create.Succeeded)
                        throw new Exception("Failed to create admin user: " + string.Join("; ", create.Errors.Select(e => e.Description)));
                }

                if (!await userManager.IsInRoleAsync(user, adminRole))
                    await userManager.AddToRoleAsync(user, adminRole);
            }

            await SeedAdminAsync(app);*/

            app.Run();
        }
    }
}
