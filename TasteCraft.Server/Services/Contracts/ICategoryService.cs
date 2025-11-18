using TasteCraft.Server.DTOs.Categories;

namespace TasteCraft.Server.Services.Contracts
{
    public interface ICategoryService
    {
        Task<List<CategoryListDto>> GetAllAsync();
        Task<CategoryDetailsDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(CategoryCreateOrEditDto dto);
        Task UpdateAsync(int id, CategoryCreateOrEditDto dto);
        Task SoftDeleteAsync(int id);


    }
}
