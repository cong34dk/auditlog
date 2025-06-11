using Microsoft.EntityFrameworkCore;

namespace auditlog_backend.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options) { }

        public DbSet<Product> Products { get; set; } = null!;
    }
}
