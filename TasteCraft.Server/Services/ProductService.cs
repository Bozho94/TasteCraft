using Microsoft.EntityFrameworkCore;
using TasteCraft.Server.Data;
using TasteCraft.Server.Data.Models;
using TasteCraft.Server.DTOs.Products;
using TasteCraft.Server.Services.Contracts;

namespace TasteCraft.Server.Services
{
    public class ProductService : IProductService
    {
        private readonly TasteCraftDbContext _db;
        public ProductService(TasteCraftDbContext db)
        {
            _db = db;
        }

        public async Task<int> CreateAsync(ProductCreateOrEditDto dto)
        {
            var existingCategory = _db.Categories.Any(c => c.Id == dto.CategoryId);
            if (!existingCategory)
            {
                throw new KeyNotFoundException("Category does not exist.");
            }

            var entity = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                PricePerUnit = dto.PricePerUnit,
                ImageUrl = dto.ImageUrl,
                CategoryId = dto.CategoryId,

            };
            _db.Products.Add(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<List<ProductListDto>> GetByCategoryAsync(int categoryId)
        {
              return await _db.Products
               .AsNoTracking()
               .Where(p => p.CategoryId == categoryId)
               .OrderBy(p => p.Name)
               .Select(p => new ProductListDto
               {
                   Id = p.Id,
                   Name = p.Name,
                   PricePerUnit = p.PricePerUnit,
                   ImageUrl = p.ImageUrl,
                   Description = p.Description
               })
               .ToListAsync();
        }

        public async Task<ProductDetailsDto?> GetByIdAsync(int id)
        {
            return await _db.Products
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new ProductDetailsDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    PricePerUnit = p.PricePerUnit,
                    ImageUrl = p.ImageUrl,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name
                })
                .FirstOrDefaultAsync();
        }

        public async Task SoftDeleteAsync(int id)
        {
            var entity = await _db.Products
                .FirstOrDefaultAsync(p => p.Id == id);
            if (entity != null)
                {
                entity.IsDeleted = true;
                await _db.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException("Product not found.");
            }
        }

        public async Task UpdateAsync(int id, ProductCreateOrEditDto dto)
        {
            var entity = await _db.Products
                .FirstOrDefaultAsync(p => p.Id == id);
            if (entity == null)
            {
                throw new KeyNotFoundException("Product not found.");
            }

            entity.Name = dto.Name;
            entity.Description = dto.Description;
            entity.PricePerUnit = dto.PricePerUnit;
            entity.ImageUrl = dto.ImageUrl;
            entity.CategoryId = dto.CategoryId;

            await _db.SaveChangesAsync();
        }
    }
}
