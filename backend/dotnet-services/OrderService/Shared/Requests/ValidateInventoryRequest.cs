using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.DTOS;

namespace Shared.Requests
{
    public class ValidateInventoryRequest
    {
        public List<OrderItemDto> Items { get; set; } = new();

    }
}
