using TasteCraft.Server.DTOs.Products;

namespace TasteCraft.Server.Services.Contracts
{
    public interface IProductService
    {
        Task<List<ProductListDto>> GetByCategoryAsync(int categoryId);
        Task<ProductDetailsDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(ProductCreateOrEditDto dto);
        Task UpdateAsync(int id, ProductCreateOrEditDto dto);
        Task SoftDeleteAsync(int id);
    }
}
