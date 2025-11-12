using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using static TasteCraft.Server.EntityConstraints.OrderStatus;
using static TasteCraft.Server.EntityConstraints.ValidationConst.Order;

namespace TasteCraft.Server.Data.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int OrderNumber { get; set; }

        [Required]
        public string UserId { get; set; } = null!;
        public IdentityUser User { get; set; } = null!;

        public DateOnly OrderDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);

        [Required, MaxLength(FullNameMaxLength)]
        public string FullName { get; set; } = null!;

        [Required, MaxLength(AddressMaxLength)]
        public string DeliveryAddress { get; set; } = null!;

        [Required, MaxLength(PhoneMaxLength)]
        public string PhoneNumber { get; set; } = null!;

        [Precision(10, 2)]
        public decimal TotalPrice { get; set; }

        [Required, MaxLength(StatusMaxLength)]
        public string Status { get; set; } = Pending;

        public bool IsDeleted { get; set; }

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
