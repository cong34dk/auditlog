using System.ComponentModel.DataAnnotations;

namespace auditlog_backend.Models
{
    public class Collection
    {
        [Key]
        public int Id { get; set; }
        public required string ImgUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

    }
}
