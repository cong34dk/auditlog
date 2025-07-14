using auditlog_backend.DTOs.Product;
using auditlog_backend.Helper;
using auditlog_backend.Models;
using EFCore.BulkExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System.Diagnostics;

namespace auditlog_backend.Controllers
{
    [Authorize]
    [Route("api/product/[action]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        public ProductController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string? search, int page = 1, int pageSize = 10)
        {
            var stopwatch = Stopwatch.StartNew();
            var query = _dbContext.Products
                .AsNoTracking()
                .OrderByDescending(p => p.CreatedAt)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.ToUpper().Contains(search.ToUpper()));
            }

            var totalRecord = await query.CountAsync();
            //var totalPages = (int)Math.Ceiling((double)totalRecord / pageSize);

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Description = p.Description,
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
                Products = products
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _dbContext.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            var productDto = HelperMapper.Map<Product, ProductDto>(product);

            return Ok(productDto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDto param)
        {
            if (param == null)
            {
                return BadRequest("Product data is required");
            }

            var product = HelperMapper.Map<CreateProductDto, Product>(param);
            product.CreatedAt = DateTime.Now;


            _dbContext.Products.Add(product);
            await _dbContext.SaveChangesAsync();

            var productDto = HelperMapper.Map<Product, ProductDto>(product);

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, productDto);
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto param)
        {
            var obj = await _dbContext.Products.FindAsync(id);
            if (obj == null)
            {
                return NotFound();
            }
            if (param == null)
            {
                return BadRequest("Product data is required");
            }

            HelperMapper.MapToExisting(param, obj);
            obj.CreatedAt = obj.CreatedAt == default ? DateTime.Now : obj.CreatedAt;

            _dbContext.Products.Update(obj);
            await _dbContext.SaveChangesAsync();

            var productDto = HelperMapper.Map<Product, ProductDto>(obj);

            return Ok(productDto);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _dbContext.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _dbContext.Products.Remove(product);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAll()
        {
            var products = await _dbContext.Products.ToListAsync();
            if (products == null || !products.Any())
            {
                return NotFound("No products found to delete");
            }

            _dbContext.Products.RemoveRange(products);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet]
        public IActionResult DownloadTemplate()
        {
            using (var package = new ExcelPackage())
            {
                var sheet = package.Workbook.Worksheets.Add("ProductTemplate");

                // Tạo header
                sheet.Cells[1, 1].Value = "Name";
                sheet.Cells[1, 2].Value = "Price";
                sheet.Cells[1, 3].Value = "Description";

                sheet.Cells[1, 1, 1, 3].Style.Font.Bold = true;

                var fileBytes = package.GetAsByteArray();
                var fileName = "ProductTemplate.xlsx";
                return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
        }

        [HttpPost]
        public async Task<IActionResult> ImportTemplate(IFormFile file)
        {
            if (file == null || file.Length <= 0)
            {
                return BadRequest("Vui lòng chọn file Excel import hợp lệ");
            }

            var products = new List<Product>();

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            using var package = new ExcelPackage(stream);
            var worksheet = package.Workbook.Worksheets.First();
            int rowCount = worksheet.Dimension.Rows;

            for (int row = 2; row <= rowCount; row++)
            {
                var product = new Product
                {
                    Name = worksheet.Cells[row, 1].Text,
                    Price = decimal.TryParse(worksheet.Cells[row, 2].Text, out var price) ? price : 0,
                    Description = worksheet.Cells[row, 3].Text,
                    CreatedAt = DateTime.Now
                };
                products.Add(product);
            }

            await _dbContext.BulkInsertAsync(products);

            return Ok(new { Count = products.Count, Message = "Import Excel thành công" });
        }

        [HttpPost]
        public async Task<IActionResult> GenerateFakeData(int total)
        {
            if (total <= 0) return BadRequest("Số lượng phải lớn hơn 0");

            var stopwatch = Stopwatch.StartNew();
            var random = new Random();
            int batchSize = 100000;
            var dNow = DateTime.Now;

            _dbContext.ChangeTracker.AutoDetectChangesEnabled = false;

            for (int i = 0; i < total; i += batchSize)
            {
                var batch = new List<Product>(batchSize);
                for (int j = 0; j < batchSize && i + j < total; j++)
                {
                    batch.Add(new Product
                    {
                        Name = $"Sản phẩm {j + 1}",
                        Price = random.Next(1, 100),
                        Description = $"Mô tả sản phẩm {j + 1}",
                        CreatedAt = dNow
                    });
                }
                await _dbContext.BulkInsertAsync(batch);
            }

            stopwatch.Stop();

            return Ok(new
            {
                Count = total,
                Message = $"Đã mock data thành công {total} sản phẩm",
                TimeInMilliseconds = stopwatch.ElapsedMilliseconds,
                TimeFormatted = $"{stopwatch.Elapsed.TotalSeconds:N2} giây"
            });
        }
    }
}
