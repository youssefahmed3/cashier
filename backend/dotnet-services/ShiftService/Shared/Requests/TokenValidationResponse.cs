using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Requests
{
    public class TokenValidationResponse
    {
        public TokenValidationResponse(bool isValid, string message, UserInfo userInfo)
        {
            IsValid = isValid;
            Message = message;
            UserInfo = userInfo;
        }

        public bool IsValid { get; set; }
        public string Message { get; set; }
        public UserInfo UserInfo { get; set; }
    }
}
