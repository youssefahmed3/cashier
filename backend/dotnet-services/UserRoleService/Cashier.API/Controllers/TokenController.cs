namespace Cashier.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController(ITokenValidator _tokenValidator) : ControllerBase
    {
        [HttpPost("validate")]
        public async Task<IActionResult> ValidateToken([FromBody] TokenValidationRequest request)
        {
            var (isValid, message, principal, claims) = await _tokenValidator.ValidateTokenAsync(request.Token);

            if (!isValid)
                return Ok(new { success = false, message });

            return Ok(new
            {
                success = true,
                message = "Token is valid",
                claims = claims  
            });
        }
    }
}
