using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Reporting.Infrastructure.Data;

namespace Reporting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuperReportingController : ControllerBase
    {
        private readonly TenantDbContext _context;

        public SuperReportingController(TenantDbContext context)
        {
            _context = context;
        }


    }
}
