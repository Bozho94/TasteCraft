using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TasteCraft.Server.DTOs.Orders;
using TasteCraft.Server.Services.Contracts;

namespace TasteCraft.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;
        public OrdersController(IOrderService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var orderId = await _service.CreateAsync(userId, dto);
            return Ok(orderId);
        }

        [HttpGet("mine")]
        [Authorize]
        public async Task<IActionResult> GetMine()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var orders = await _service.GetMineAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetDetailsAsync(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var isAdmin = User.IsInRole("Admin");
            var result = await _service.GetDetailsAsync(userId, id, isAdmin);
            return result is null ? NotFound() : Ok(result);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatusUpdateDto dto)
        {
            await _service.UpdateStatusAsync(id, dto.Status);
            return NoContent();
        }

        [HttpGet("admin/details")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllDetails([FromQuery] string? status = null)
        {
            var orders = await _service.GetAllDetailsAsync(status);
            return Ok(orders);
        }

    }
}
