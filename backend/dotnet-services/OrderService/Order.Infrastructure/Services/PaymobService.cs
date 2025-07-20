using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Order.Core.Interfaces.Services;
using Order.Infrastructure.Settings;
using Shared.DTOS;
using Shared.PaymentProviders.Paymob;

namespace Order.Infrastructure.Services
{
    public class PaymobService : IPaymobService
    {
        private readonly PaymobSettings _settings;
        private readonly HttpClient _httpClient;

        public PaymobService(IOptions<PaymobSettings> settings, HttpClient httpClient)
        {
            _settings = settings.Value;
            _httpClient = httpClient;
        }
        public async Task<ResultDto<string>> GetAuthTokenAsync()
        {
            try
            {
                var authUrl = $"{_settings.BaseUrl}{_settings.AuthEndpoint}";
                var payload = new { api_key = _settings.ApiKey };
                var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

                using var response = await _httpClient.PostAsync(authUrl, content);
                var responseBody = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return ResultDto<string>.Failure($"Auth request failed: {response.StatusCode}, {responseBody}");
                }

                var result = JsonConvert.DeserializeObject<PaymobAuthTokenResponse>(responseBody);
                if (result == null || string.IsNullOrWhiteSpace(result.Token))
                {
                    return ResultDto<string>.Failure("Auth response was null or missing token.");
                }

                return ResultDto<string>.Success(result.Token);
            }
            catch (Exception ex)
            {
                return ResultDto<string>.Failure($"Unexpected error during auth: {ex.Message}");
            }
        }
        public async Task<ResultDto<PaymobIntentionResponse>> CreateIntentionAsync(PaymobIntentionRequest request)
        {
            try
            {
                var url = $"{_settings.BaseUrl}{_settings.IntentionEndpoint}";
                var serializedRequest = JsonConvert.SerializeObject(request);

                var requestMessage = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = new StringContent(serializedRequest, Encoding.UTF8, "application/json")
                };

                requestMessage.Headers.Add("Authorization", $"Token {_settings.SecretKey}");

                using var response = await _httpClient.SendAsync(requestMessage);
                var responseBody = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return ResultDto<PaymobIntentionResponse>.Failure(
                        $"Intention request failed: {response.StatusCode}, {responseBody}");
                }

                var result = JsonConvert.DeserializeObject<PaymobIntentionResponse>(responseBody);
                if (result == null)
                {
                    return ResultDto<PaymobIntentionResponse>.Failure("Intention response was null.");
                }

                return ResultDto<PaymobIntentionResponse>.Success(result);
            }
            catch (Exception ex)
            {
                return ResultDto<PaymobIntentionResponse>.Failure($"Unexpected error: {ex.Message}");

            }
        }

        public async Task<ResultDto<PaymobTransactionResponse>> GetTransactionIdAsync(string specialReference)
        {
            try
            {
                var tokenResult = await GetAuthTokenAsync();
                if (!tokenResult.IsSuccess || string.IsNullOrWhiteSpace(tokenResult.Value))
                {
                    return ResultDto<PaymobTransactionResponse>.Failure(
                        $"Failed to retrieve auth token: {tokenResult.Error}");
                }

                var url = $"{_settings.BaseUrl}/api/ecommerce/orders/transaction_inquiry";
                var serializedRequest = JsonConvert.SerializeObject(new
                {
                    merchant_order_id = specialReference
                });

                var requestMessage = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = new StringContent(serializedRequest, Encoding.UTF8, "application/json")
                };

                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.Value);

                using var response = await _httpClient.SendAsync(requestMessage);
                var responseBody = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return ResultDto<PaymobTransactionResponse>.Failure(
                        $"Intention request failed: {response.StatusCode}, {responseBody}");
                }

                var result = JsonConvert.DeserializeObject<PaymobTransactionResponse>(responseBody);
                if (result == null)
                {
                    return ResultDto<PaymobTransactionResponse>.Failure(
                        $"Failed to deserialize response: {responseBody}");
                }

                return ResultDto<PaymobTransactionResponse>.Success(result);
            }
            catch (Exception ex)
            {
                return ResultDto<PaymobTransactionResponse>.Failure($"Unexpected error: {ex.Message}");
            }
        }

        public async Task<ResultDto<PaymobRefundResponse>> RefundPaymentAsync(long originalTransactionId, decimal amount)
        {
            try
            {
                var tokenResult = await GetAuthTokenAsync();
                if (!tokenResult.IsSuccess || string.IsNullOrWhiteSpace(tokenResult.Value))
                {
                    return ResultDto<PaymobRefundResponse>.Failure(
                        $"Failed to retrieve auth token: {tokenResult.Error}");
                }


                var url = $"{_settings.BaseUrl}/api/acceptance/void_refund/refund";
                var serializedRequest = JsonConvert.SerializeObject(new
                {
                    transaction_id = originalTransactionId,
                    amount_cents = amount
                });

                var requestMessage = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = new StringContent(serializedRequest, Encoding.UTF8, "application/json")
                };

                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.Value);

                using var response = await _httpClient.SendAsync(requestMessage);
                var responseBody = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return ResultDto<PaymobRefundResponse>.Failure(
                        $"Intention request failed: {response.StatusCode}, {responseBody}");
                }

                var result = JsonConvert.DeserializeObject<PaymobRefundResponse>(responseBody);
                if (result == null)
                {
                    return ResultDto<PaymobRefundResponse>.Failure(
                        $"Failed to deserialize response: {responseBody}");
                }

                return ResultDto<PaymobRefundResponse>.Success(result);
            }
            catch (Exception ex)
            {
                return ResultDto<PaymobRefundResponse>.Failure($"Unexpected error: {ex.Message}");
            }

        }


    }


}

