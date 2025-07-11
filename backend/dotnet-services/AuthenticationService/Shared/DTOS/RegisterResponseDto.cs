namespace Cashier.Shared.DTOS
{
    public class RegisterResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public IEnumerable<string> Errors { get; set; } = new List<string>();
    }
}
