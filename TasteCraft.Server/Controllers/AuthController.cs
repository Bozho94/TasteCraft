using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TasteCraft.Server.DTOs.Auth;

namespace TasteCraft.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public AuthController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserInfoDto>> Me()
        {
            if (User?.Identity == null || !User.Identity.IsAuthenticated)
            {
                return new UserInfoDto
                {
                    IsAuthenticated = false
                };
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return new UserInfoDto
                {
                    IsAuthenticated = false
                };
            }

            var roles = await _userManager.GetRolesAsync(user);

            return new UserInfoDto
            {
                IsAuthenticated = true,
                Email = user.Email,
                Roles = roles.ToList()
            };
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return NoContent();
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // 1) Проверяваме паролите дали съвпадат
            if (dto.Password != dto.ConfirmPassword)
            {
                return BadRequest("Паролите не съвпадат.");
            }

            // 2) Проверяваме дали вече има такъв email
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return BadRequest("Вече има потребител с такъв имейл.");
            }

            // 3) Създаваме нов IdentityUser
            var user = new IdentityUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                EmailConfirmed = true // за да не играем с e-mail потвърждение
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                // връщаме грешките от Identity (например "паролата е твърде слаба")
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(string.Join("; ", errors));
            }

            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok();
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // 1) намираме потребителя по email
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return Unauthorized("Невалиден email или парола.");
            }

            // 2) опитваме да влезем
            var result = await _signInManager.PasswordSignInAsync(
                user,
                dto.Password,
                isPersistent: false,   // Remember me? -> за сега false
                lockoutOnFailure: false);

            if (!result.Succeeded)
            {
                return Unauthorized("Невалиден email или парола.");
            }

            // 3) Ако успее -> Identity автоматично слага auth cookie в отговора
            return Ok();
        }
    }
}
