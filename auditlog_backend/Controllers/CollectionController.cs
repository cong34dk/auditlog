using auditlog_backend.DTOs.Collection;
using auditlog_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace auditlog_backend.Controllers
{
    [Authorize]
    [Route("api/collection/[action]")]
    [ApiController]
    public class CollectionController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IWebHostEnvironment _webHostEnv;
        public CollectionController(AppDbContext dbContext, IWebHostEnvironment webHostEnv)
        {
            _dbContext = dbContext;
            _webHostEnv = webHostEnv;
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var uploadsFolder = Path.Combine(_webHostEnv.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";

            var collection = new Collection
            {
                ImgUrl = imageUrl,
                CreatedAt = DateTime.Now
            };

            _dbContext.Collections.Add(collection);
            await _dbContext.SaveChangesAsync();

            return Ok(new { data = collection, statusCode = 200 });
        }

        [HttpGet]
        public async Task<IActionResult> Get(string? search, int page = 1, int pageSize = 10)
        {
            var stopwatch = Stopwatch.StartNew();
            var query = _dbContext.Collections
                .AsNoTracking()
                .OrderByDescending(p => p.CreatedAt)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.ImgUrl.ToUpper().Contains(search.ToUpper()));
            }

            var totalRecord = await query.CountAsync();
            //var totalPages = (int)Math.Ceiling((double)totalRecord / pageSize);

            var collections = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new CollectionDto
                {
                    Id = p.Id,
                    ImgUrl = p.ImgUrl,
                    CreatedAt = p.CreatedAt
                }).ToListAsync();

            stopwatch.Stop();

            return Ok(new
            {
                TotalRecord = totalRecord,
                TotalPages = (int)Math.Ceiling((double)totalRecord / pageSize),
                CurrentPage = page,
                TimeInMilliseconds = stopwatch.ElapsedMilliseconds,
                TimeFormatted = $"{stopwatch.Elapsed.TotalSeconds:N2} giây",
                Data = collections
            });
        }
    }
}
