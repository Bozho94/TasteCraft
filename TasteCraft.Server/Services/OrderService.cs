using Microsoft.EntityFrameworkCore;
using TasteCraft.Server.Data;
using TasteCraft.Server.Data.Models;
using TasteCraft.Server.DTOs.Orders;
using TasteCraft.Server.EntityConstraints;
using TasteCraft.Server.Services.Contracts;

namespace TasteCraft.Server.Services
{
    public class OrderService : IOrderService
    {
        private readonly TasteCraftDbContext _db;
        public OrderService(TasteCraftDbContext db)
        {
            _db = db;
        }

        public async Task<int> CreateAsync(string userId, OrderCreateDto dto)
        {
            if (dto.Items == null || dto.Items.Count == 0)
            {
                throw new InvalidOperationException("Order must contain items.");
            }

            var orderNumber = await _db.Orders
               .IgnoreQueryFilters()
               .Select(o => (int?)o.OrderNumber)
               .MaxAsync() ?? 0;
            orderNumber += 1;

            var order = new Order
            {
                UserId = userId,
                OrderNumber = orderNumber,
                OrderDate = DateOnly.FromDateTime(DateTime.UtcNow),
                FullName = dto.FullName,
                DeliveryAddress = dto.DeliveryAddress,
                PhoneNumber = dto.PhoneNumber,
                Status = OrderStatus.Pending,
                TotalPrice = 0m

            };

            foreach (var item in dto.Items)
            {
                var product = await _db.Products
                    .FirstOrDefaultAsync(p => p.Id == item.ProductId);

                if (product == null)
                {
                    throw new KeyNotFoundException($"Product {item.ProductId} not found.");
                }

                if (item.Quantity <= 0)
                {
                    throw new InvalidOperationException("Item weight must be greater than zero.");
                }

                var lineTotal = Math.Round(product.PricePerUnit * item.Quantity, 2);

                order.Items.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    ProductName = product.Name, // историческо копие
                    UnitPrice = product.PricePerUnit, // историческо копие
                    Quantity = item.Quantity,
                    LineTotal = lineTotal
                });

                order.TotalPrice += lineTotal;
            }

            order.TotalPrice = Math.Round(order.TotalPrice, 2);
            _db.Orders.Add(order);
            await _db.SaveChangesAsync();
            return order.Id;


        }

        public async Task<List<OrderDetailsDto>> GetAllDetailsAsync(string? status = null)
        {
            var query = _db.Orders
                .AsNoTracking();

            if(!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(o => o.Status == status);
            }

            return await query
                .OrderByDescending(o => o.Id)
                .Select(o => new OrderDetailsDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    Status = o.Status,
                    FullName = o.FullName,
                    DeliveryAddress = o.DeliveryAddress,
                    PhoneNumber = o.PhoneNumber,
                    TotalPrice = o.TotalPrice,
                    Items = o.Items.Select(oi => new OrderItemDto
                    {
                        ProductName = oi.ProductName,
                        UnitPrice = oi.UnitPrice,
                        Quantity = oi.Quantity,
                        LineTotal = oi.LineTotal,

                    }).ToList()
                })
                .ToListAsync();
                
        }

        public async Task<OrderDetailsDto?> GetDetailsAsync(string userId, int orderId, bool isAdmin = false)
        {
            var query = _db.Orders
                .AsNoTracking()
                .Where(o => o.Id == orderId);
            if (!isAdmin)
            {
               query = query
                .Where(o => o.UserId == userId);
            }

            return await query
                .Select(o => new OrderDetailsDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    FullName = o.FullName,
                    DeliveryAddress = o.DeliveryAddress,
                    PhoneNumber = o.PhoneNumber,
                    TotalPrice = o.TotalPrice,
                    Items = o.Items.Select(oi => new OrderItemDto
                    {
                        ProductName = oi.ProductName,
                        UnitPrice = oi.UnitPrice,
                        Quantity = oi.Quantity,
                        LineTotal = oi.LineTotal
                    }).ToList()
                }).FirstOrDefaultAsync();
        }

        public async Task<List<OrderListDto>> GetMineAsync(string userId)
        {
            return await _db.Orders
                .AsNoTracking()
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.Id)
                .Select(o => new OrderListDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    TotalPrice = o.TotalPrice
                })
                .ToListAsync();
        }

        public async Task UpdateStatusAsync(int orderId, string newStatus)
        {
            var order = await _db.Orders
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null)
            {
                 throw new KeyNotFoundException("Order not found.");
            }

            if (newStatus != OrderStatus.Pending &&
                newStatus != OrderStatus.Shipped &&
                newStatus != OrderStatus.Cancelled)
            {
                throw new InvalidOperationException("Invalid status");
            }

            order.Status = newStatus;
            await _db.SaveChangesAsync();

        }
    }
}
