using System.ComponentModel.DataAnnotations;

namespace auditlog_backend.Models
{
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string TableName { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
    }
}
