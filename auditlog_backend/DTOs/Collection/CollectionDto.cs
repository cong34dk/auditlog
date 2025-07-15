namespace auditlog_backend.DTOs.Collection
{
    public class CollectionDto
    {
        public int Id { get; set; }
        public required string ImgUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
