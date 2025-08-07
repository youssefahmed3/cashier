using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Shared.Requests
{
    public class TokenValidationRequest
    {
        [JsonProperty("token")]
        public string Token { get; set; }
    }
}
