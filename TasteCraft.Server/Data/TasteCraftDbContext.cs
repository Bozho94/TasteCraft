using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TasteCraft.Server.Data.Models;

namespace TasteCraft.Server.Data
{
    public class TasteCraftDbContext : IdentityDbContext<IdentityUser>
    {
        public TasteCraftDbContext(DbContextOptions<TasteCraftDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // SOFT DELETE FILTERS
            // показвай само тези, които НЕ са изтрити
            builder.Entity<Category>()
                .HasQueryFilter(c => !c.IsDeleted);

            builder.Entity<Product>()
                .HasQueryFilter(p => !p.IsDeleted);

            builder.Entity<Order>()
                .HasQueryFilter(o => !o.IsDeleted);

            builder.Entity<OrderItem>()
                .HasQueryFilter(oi => !oi.Order.IsDeleted && !oi.Product.IsDeleted);
        }
    }
}
