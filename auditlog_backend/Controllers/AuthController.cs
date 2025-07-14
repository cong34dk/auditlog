using auditlog_backend.Models;
using auditlog_backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using auditlog_backend.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using auditlog_backend.Helper;

namespace auditlog_backend.Controllers
{
    [Authorize]
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

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Register(RegisterDto param)
        {
            var user = new User
            {
                Username = param.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(param.Password),
                FullName = param.FullName,
                AvatarUrl = Consts.DefaultAvatarUrl
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "User registered successfully" });
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login(LoginDto param)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Username == param.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(param.Password, user.Password))
                return Ok(new { message = "Invalid username or password", statusCode = 401 });

            var token = _jwtService.GenerateToken(user);
            return Ok(new { token, fullName = user.FullName, avatarUrl = user.AvatarUrl, statusCode = 200 });
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto param)
        {
            try
            {
                var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(param.IdToken);
                if (payload == null)
                    return BadRequest(new { message = "Invalid Google token" });

                var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Username == payload.Email);
                if (user == null)
                {
                    user = new User
                    {
                        Username = payload.Email,
                        Password = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                        FullName = payload.Name,
                        Email = payload.Email,
                        AvatarUrl = payload.Picture ?? Consts.DefaultAvatarUrl
                    };
                    _dbContext.Users.Add(user);
                    await _dbContext.SaveChangesAsync();
                }

                var token = _jwtService.GenerateToken(user);
                return Ok(new { token, fullName = user.FullName, avatarUrl = user.AvatarUrl, statusCode = 200 });
            }
            catch (Exception ex)
            {

                return BadRequest(new { message = "Google login failed", error = ex.Message });
            }
        }
    }
}
