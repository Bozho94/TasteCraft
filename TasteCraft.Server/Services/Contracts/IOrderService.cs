using TasteCraft.Server.DTOs.Orders;

namespace TasteCraft.Server.Services.Contracts
{
    public interface IOrderService
    {
        Task<int> CreateAsync(string userId, OrderCreateDto dto);
        Task<List<OrderListDto>> GetMineAsync(string userId);
        Task<OrderDetailsDto?> GetDetailsAsync(string userId, int orderId, bool isAdmin = false);
        Task UpdateStatusAsync(int orderId, string newStatus);
        Task <List<OrderDetailsDto>> GetAllDetailsAsync(string? status =null);
    }
}
