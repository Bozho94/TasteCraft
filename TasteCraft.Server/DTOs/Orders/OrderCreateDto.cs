using Microsoft.EntityFrameworkCore.Metadata;

namespace TasteCraft.Server.DTOs.Orders
{
    public class OrderCreateDto
    {
        public string FullName { get; set; } = null!;
        public string DeliveryAddress { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public List<OrderItemCreateDto> Items { get; set; } = new();
    }
}
