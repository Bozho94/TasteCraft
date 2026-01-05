namespace TasteCraft.Server.DTOs.Auth
{
    public class UserInfoDto
    {
        public bool IsAuthenticated { get; set; }

        public string? Email { get; set; }

        public List<string> Roles { get; set; } = new();
    }
}
