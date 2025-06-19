using auditlog_backend.Models;
using auditlog_backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using auditlog_backend.DTOs.User;

namespace auditlog_backend.Controllers
{
    [Route("api/auth/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IJwtService _jwtService;

        public AuthController(AppDbContext dbContext, IJwtService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        [HttpPost]
        public async Task<IActionResult> Register(User param)
        {
            param.Password = BCrypt.Net.BCrypt.HashPassword(param.Password);
            _dbContext.Users.Add(param);
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost]
        public async Task<IActionResult> Login(UserDto param)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Username == param.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(param.Password, user.Password))
                return Ok(new { message = "Invalid username or password" , statusCode = 401});

            var token = _jwtService.GenerateToken(user);
            return Ok(new { token, statusCode = 200});
        }
    }
}
