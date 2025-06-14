using auditlog_backend.DTOs.Product;
using auditlog_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var query = _dbContext.Products.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search));
            }

            var totalRecord = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalRecord / pageSize);

            var products = await query
                .OrderByDescending(p => p.CreatedAt)
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

            return Ok(new
            {
                TotalRecord = totalRecord,
                TotalPages = totalPages,
                CurrentPage = page,
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
            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                CreatedAt = product.CreatedAt
            };
            return Ok(productDto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDto param)
        {
            if (param == null)
            {
                return BadRequest("Product data is required");
            }

            var product = new Product
            {
                Name = param.Name,
                Price = param.Price,
                Description = param.Description,
                CreatedAt = DateTime.Now
            };

            _dbContext.Products.Add(product);
            await _dbContext.SaveChangesAsync();

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                CreatedAt = product.CreatedAt
            };

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

            obj.Name = param.Name;
            obj.Price = param.Price;
            obj.Description = param.Description;
            obj.CreatedAt = DateTime.Now;

            _dbContext.Products.Update(obj);
            await _dbContext.SaveChangesAsync();

            var productDto = new ProductDto
            {
                Id = obj.Id,
                Name = obj.Name,
                Price = obj.Price,
                Description = obj.Description,
                CreatedAt = obj.CreatedAt
            };
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
    }
}
