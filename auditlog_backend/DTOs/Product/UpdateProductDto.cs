﻿namespace auditlog_backend.DTOs.Product
{
    public class UpdateProductDto
    {
        public string? Name { get; set; }
        public decimal? Price { get; set; }
        public string? Description { get; set; }
    }
}
