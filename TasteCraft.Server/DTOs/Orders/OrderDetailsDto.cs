namespace TasteCraft.Server.DTOs.Orders
{
    public class OrderDetailsDto
    {
        public int Id { get; set; }
        public int OrderNumber { get; set; }

        public DateOnly OrderDate { get; set; }

        public string Status { get; set; } = null!;

        public string FullName { get; set; } = null!;

        public string DeliveryAddress { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public decimal TotalPrice { get; set; }

        public List<OrderItemDto> Items { get; set; } = new();


    }
}
