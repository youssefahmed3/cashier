using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.Requests;

namespace Order.Core.Interfaces.Services
{
    public interface ITokenValidationClient
    {
        Task<TokenValidationResponse> ValidateTokenAsync(TokenValidationRequest request);

    }
}
