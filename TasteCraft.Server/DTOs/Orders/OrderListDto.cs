namespace TasteCraft.Server.DTOs.Orders
{
    public class OrderListDto
    {
        public int Id { get; set; }

        public int OrderNumber { get; set; }

        public DateOnly OrderDate { get; set; }

        public string Status { get; set; } = null!;

        public decimal TotalPrice { get; set; }

    }
}
