using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Reporting.Shared.DTOS;

namespace Reporting.Core.Interfaces
{
    public interface IOrderApiService
    {
        Task<List<OrderDto>> GetAllOrdersAsync();
    }
}
