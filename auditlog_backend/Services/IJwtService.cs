using auditlog_backend.Models;

namespace auditlog_backend.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}