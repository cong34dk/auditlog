using System.ComponentModel.DataAnnotations;

namespace auditlog_backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? FullName { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; } = string.Empty;

    }
}
