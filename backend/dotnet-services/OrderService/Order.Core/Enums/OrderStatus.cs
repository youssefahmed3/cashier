using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Core.Enums
{
    public enum OrderStatus
    {
        New,
        InProgress,
        OnHold,
        Completed,
        Canceled,
        PartiallyRefunded,
        Refunded,
    }
}
