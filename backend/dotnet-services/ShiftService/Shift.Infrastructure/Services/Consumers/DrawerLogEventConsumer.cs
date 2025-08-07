using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Events;
using Shift.Core.Entities;
using Shift.Core.Enums;
using Shift.Core.Interfaces.Repositories;

public class DrawerLogEventConsumer(IUnitOfWork _unitOfWork, ILogger<DrawerLogEventConsumer> _logger)
    : IConsumer<DrawerLogEvent>
{
    public async Task Consume(ConsumeContext<DrawerLogEvent> context)
    {
        try
        {
            var @event = context.Message;

            _logger.LogInformation("Received DrawerLogEvent: {@Event}", @event);

            if (!Enum.TryParse<TransactionType>(@event.TransactionType, out var transactionType))
            {
                _logger.LogWarning("Invalid TransactionType received: {TransactionType}. PaymentId: {PaymentId}",
                    @event.TransactionType, @event.PaymentId);
                return;
            }

            var drawerLog = new DrawerLog
            {
                BranchId = @event.BranchId,
                ShiftId = @event.ShiftId,
                TransactionType = transactionType,
                Amount = @event.Amount,
                Reference = @event.Reference,
                CreatedAt = @event.CreatedAt ?? DateTime.UtcNow,
                PaymentId = @event.PaymentId
            };

            _logger.LogInformation("Attempting to add DrawerLog to repository: {@DrawerLog}", drawerLog);

            await _unitOfWork.DrawerLogRepository.AddAsync(drawerLog);

            var result = await _unitOfWork.SaveChangesAsync();

            _logger.Log(result > 0 ? LogLevel.Information : LogLevel.Error,
                "Insert DrawerLog with PaymentId: {PaymentId} ==> {Status}",
                @event.PaymentId,
                result > 0 ? "Succeeded" : "Failed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while processing DrawerLogEvent: {@Event}", context.Message);
        }
    }
}
