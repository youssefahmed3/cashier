using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Collections.Generic;
using Order.Infrastructure.Settings;
using Shared.Requests;
using Microsoft.Extensions.Configuration;
using Order.Core.Interfaces.Services;

public class TokenValidationClient : ITokenValidationClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<TokenValidationClient> _logger;
    private readonly IConfiguration _configuration;

    public TokenValidationClient(
        HttpClient httpClient,
        ILogger<TokenValidationClient> logger,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration
;
    }

public async Task<TokenValidationResponse> ValidateTokenAsync(TokenValidationRequest request)
    {
        try
        {
            var baseUrl = $"{_configuration["ServicesURLs:BaseUrl"]}/auth";
            var url = $"{baseUrl}/api/token/validate";
            
            var jsonContent = JsonConvert.SerializeObject(request);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            _logger.LogInformation("Sending token validation request to: {Url}", url);
            _logger.LogDebug("Request payload: {JsonContent}", jsonContent);

            var response = await _httpClient.PostAsync(url, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("Received response with status code: {StatusCode}", response.StatusCode);
            _logger.LogDebug("Response body: {ResponseBody}", responseBody);

            if (response.IsSuccessStatusCode)
            {
                // Deserialize to the actual response format from your auth service
                var authServiceResponse = JsonConvert.DeserializeObject<AuthServiceValidationResponse>(responseBody);

                if (authServiceResponse != null)
                {
                    _logger.LogInformation("Token validation response: Success={Success}, Message={Message}", authServiceResponse.Success, authServiceResponse.Message);

                    if (authServiceResponse.Success && authServiceResponse.Claims != null)
                    {
                        // Convert the claims dictionary to UserInfo
                        var userInfo = new UserInfo
                        {
                            UserId = authServiceResponse.Claims.GetValueOrDefault("userId"),
                            Username = authServiceResponse.Claims.GetValueOrDefault("email"), // or whatever field contains username
                            Roles = authServiceResponse.Claims.GetValueOrDefault("roles")?.Split(',')
                                    .Where(r => !string.IsNullOrWhiteSpace(r))
                                    .ToArray() ?? new string[0]
                        };

                        return new TokenValidationResponse(true, authServiceResponse.Message, userInfo);
                    }
                    else
                    {
                        return new TokenValidationResponse(false, authServiceResponse.Message, null);
                    }
                }

                _logger.LogWarning("Deserialized response is null.");
                return new TokenValidationResponse(false, "Invalid response format.", null);
            }
            else
            {
                _logger.LogWarning("Token validation failed. Status code: {StatusCode}, Response body: {ResponseBody}",
                    response.StatusCode, responseBody);

                // Try to parse error response
                try
                {
                    var errorResponse = JsonConvert.DeserializeObject<AuthServiceValidationResponse>(responseBody);
                    if (errorResponse != null)
                    {
                        return new TokenValidationResponse(false, errorResponse.Message, null);
                    }
                }
                catch
                {
                    // If can't parse error response, use generic message
                }

                return new TokenValidationResponse(false, $"Validation failed with status code {response.StatusCode}", null);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred during token validation.");
            return new TokenValidationResponse(false, "Token validation service is temporarily unavailable", null);
        }
    }}
