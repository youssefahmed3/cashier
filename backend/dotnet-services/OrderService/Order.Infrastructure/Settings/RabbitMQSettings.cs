using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Infrastructure.Settings
{
    public class RabbitMQSettings
    {
        public static string SectionName => "RabbitMQSettings";
        public string HostName { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string VirtualHost { get; set; } = "/";
        public int RetryLimit { get; set; } = 3;
        public int RetryInterval { get; set; } = 5000; 
        public Dictionary<string, string> Queues { get; set; } = new();

    }


}
