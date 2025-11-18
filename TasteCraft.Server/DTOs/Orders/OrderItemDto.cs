namespace TasteCraft.Server.DTOs.Orders
{
    public class OrderItemDto
    {
        public string ProductName { get; set; } = null!;

        public decimal PricePerKg { get; set; }

        public decimal WeightInKg { get; set; }

        public decimal LineTotal { get; set; }
    }
}
