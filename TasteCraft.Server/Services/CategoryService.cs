using Microsoft.EntityFrameworkCore;
using TasteCraft.Server.Data;
using TasteCraft.Server.Data.Models;
using TasteCraft.Server.DTOs.Categories;
using TasteCraft.Server.Services.Contracts;

namespace TasteCraft.Server.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly TasteCraftDbContext _db;

        public CategoryService(TasteCraftDbContext db)
        {
            _db = db;
        }

        public async Task<int> CreateAsync(CategoryCreateOrEditDto dto)
        {
            var entity = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };
            _db.Categories.Add(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<List<CategoryListDto>> GetAllAsync()
        {
            return await _db.Categories
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .Select(c => new CategoryListDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();
        }

        public async Task<CategoryDetailsDto?> GetByIdAsync(int id)
        {
            return await _db.Categories
                .AsNoTracking()
                .Where(c => c.Id == id)
                .Select(c => new CategoryDetailsDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .FirstOrDefaultAsync();
        }

        public async Task SoftDeleteAsync(int id)
        {
            var entity = await _db.Categories
                .FirstOrDefaultAsync(c => c.Id == id);

            if (entity != null)
            {
                entity.IsDeleted = true;
                await _db.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException("Category not found");
            }

        }

        public async Task UpdateAsync(int id, CategoryCreateOrEditDto dto)
        {
            var entity = await _db.Categories
                .FirstOrDefaultAsync(c => c.Id == id);

            if (entity != null)
            {
                entity.Name = dto.Name;
                entity.Description = dto.Description;
                await _db.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException("Category not found");
            }
        }
    }
}
