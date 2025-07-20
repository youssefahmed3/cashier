using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cashier.Infrastructure.Data;
using Cashier.Core.Entities;

namespace Cashier.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly SubscriptionDbContext _context;

        public ValuesController(SubscriptionDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Subscription>>> GetSubscriptions()
        {
            return Ok(await _context.Subscriptions.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Subscription>> GetSubscription(int id)
        {
            var subscription = await _context.Subscriptions.FindAsync(id);
            if (subscription is null)
            {
                return NotFound();
            }
            return Ok(subscription);
        }

        [HttpPost]
        public async Task<ActionResult<Subscription>> AddSubscription(Subscription newSubscription)
        {
            if (newSubscription is null)
            {
                return BadRequest();
            }
            // Ensure Id is not set by client, let the database generate it
            newSubscription.Id = 0;
            _context.Subscriptions.Add(newSubscription);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSubscription), new { id = newSubscription.Id }, newSubscription);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubscription(int id, Subscription updatedSubscription)
        {
            var existingSubscription = await _context.Subscriptions.FindAsync(id);
            if (existingSubscription is null)
            {
                return NotFound();
            }

            existingSubscription.Sub_Id = updatedSubscription.Sub_Id;
            existingSubscription.IsActive = updatedSubscription.IsActive;
            existingSubscription.ExpireDate = updatedSubscription.ExpireDate;
            existingSubscription.price = updatedSubscription.price;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscription(int id)
        {
            var subscription = await _context.Subscriptions.FindAsync(id);
            if (subscription is null)
            {
                return NotFound();
            }

            _context.Subscriptions.Remove(subscription);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("active")]
        public async Task<ActionResult<List<Subscription>>> GetActiveSubscriptions()
        {
            var activeSubscriptions = await _context.Subscriptions.Where(s => s.IsActive).ToListAsync();
            if (activeSubscriptions.Count == 0)
            {
                return NotFound("No active subscriptions found.");
            }
            return Ok(activeSubscriptions);
        }

        [HttpGet("expired")]
        public async Task<ActionResult<List<Subscription>>> GetExpiredSubscriptions()
        {
            var expiredSubscriptions = await _context.Subscriptions.Where(s => !s.IsActive && s.ExpireDate < DateTime.Now).ToListAsync();
            if (expiredSubscriptions.Count == 0)
            {
                return NotFound("No expired subscriptions found.");
            }
            return Ok(expiredSubscriptions);
        }

        [HttpPatch("{id}/activate")]
        public async Task<IActionResult> AddYearSubscription(int id)
        {
            var subscription = await _context.Subscriptions.FindAsync(id);
            if (subscription is null)
            {
                return NotFound();
            }
            if (subscription.IsActive)
            {
                return BadRequest("Subscription is already active.");
            }

            subscription.IsActive = true;
            if (subscription.ExpireDate <= DateTime.Now)
            {
                subscription.ExpireDate = DateTime.Now.AddMonths(12);
            }
            else
            {
                subscription.ExpireDate = subscription.ExpireDate.AddMonths(12);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> GetSubscriptionCount()
        {
            var count = await _context.Subscriptions.CountAsync();
            return Ok(count);
        }
    }
}
