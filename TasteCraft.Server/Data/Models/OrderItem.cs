using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static TasteCraft.Server.EntityConstraints.ValidationConst.OrderItem;
namespace TasteCraft.Server.Data.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        [ForeignKey(nameof(OrderId))]
        public Order Order { get; set; } = null!;

        public int ProductId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; } = null!;

        [Required]
        [MaxLength(ProductNameMaxLength)]
        public string ProductName { get; set; } = null!; // Името на продукта към момента на поръчката

        [Precision(10, 2)]
        public decimal PricePerKg { get; set; }

        [Precision(10, 2)]
        public decimal WeightKg { get; set; }

        [Precision(10, 2)]
        public decimal LineTotal { get; set; } // PricePerKg * WeightKg
    }
}
