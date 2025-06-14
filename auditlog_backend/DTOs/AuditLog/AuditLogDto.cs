namespace auditlog_backend.DTOs.AuditLog
{
    public class AuditLogDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Action { get; set; }
        public string TableName { get; set; }
        public DateTime Timestamp { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
    }
}
