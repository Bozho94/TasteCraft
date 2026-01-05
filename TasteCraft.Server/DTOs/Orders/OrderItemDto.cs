namespace TasteCraft.Server.DTOs.Orders
{
    public class OrderItemDto
    {
        public string ProductName { get; set; } = null!;

        public decimal UnitPrice { get; set; }

        public int Quantity { get; set; }

        public decimal LineTotal { get; set; }
    }
}
