namespace Shared.Requests
{
    public class UserInfo
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public IDictionary<string, object> Claims { get; set; }
    }
}