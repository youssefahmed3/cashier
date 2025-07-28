using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Core.Interfaces.Services
{
    public interface IUserContextService
    {
        long GetUserId();
    }
}
