using auditlog_backend.DTOs.AuditLog;
using auditlog_backend.DTOs.Product;
using auditlog_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace auditlog_backend.Controllers
{
    [Authorize]
    [Route("api/AuditLog/[action]")]
    [ApiController]
    public class AuditLogController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public AuditLogController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string? search, int page = 1, int pageSize = 10)
        {
            var query = _dbContext.AuditLogs.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Username.Contains(search));
            }

            var totalRecord = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalRecord / pageSize);

            var data = await query
                .OrderByDescending(p => p.Timestamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new AuditLogDto
                {
                    Id = p.Id,
                    Username = p.Username,
                    Action = p.Action,
                    TableName = p.TableName,
                    Timestamp = p.Timestamp,
                    OldValues = p.OldValues,
                    NewValues = p.NewValues
                }).ToListAsync();

            return Ok(new
            {
                TotalRecord = totalRecord,
                TotalPages = totalPages,
                CurrentPage = page,
                Data = data
            });
        }
    }
}
