using Reporting.Core.Interfaces;
using Reporting.Shared.DTOS;
using System.Text.Json;

namespace Reporing.Service
{
    public class OrderApiService : IOrderApiService
    {
        private readonly HttpClient _httpClient;

        public OrderApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<OrderDto>> GetAllOrdersAsync()
        {
            var response = await _httpClient.GetAsync("https://externalapi.com/api/orders");
            response.EnsureSuccessStatusCode();

            var contentStream = await response.Content.ReadAsStreamAsync();
            var orders = await JsonSerializer.DeserializeAsync<List<OrderDto>>(contentStream,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return orders ?? new List<OrderDto>();
        }
    }

}
