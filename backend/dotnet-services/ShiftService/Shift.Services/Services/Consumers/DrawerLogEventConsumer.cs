using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.DTOS;
using Shift.Core.Entities;
using Shift.Core.Enums;
using Shift.Core.Interfaces.Repositories;

public class DrawerLogEventConsumer(IUnitOfWork _unitOfWork, ILogger<DrawerLogEventConsumer> _logger)
    : IConsumer<DrawerLogEvent>
{
    public async Task Consume(ConsumeContext<DrawerLogEvent> context)
    {
        var @event = context.Message;

        if (!Enum.TryParse<TransactionType>(@event.TransactionType, out var transactionType))
        {
            _logger.LogWarning("Invalid TransactionType received: {TransactionType}. PaymentId: {PaymentId}",
                @event.TransactionType, @event.PaymentId);
            return; 
        }

        await _unitOfWork.DrawerLogRepository.AddAsync(new DrawerLog
        {
            BranchId = @event.BranchId,
            ShiftId = @event.ShiftId,
            TransactionType = transactionType,
            Amount = @event.Amount,
            Reference = @event.Reference,
            CreatedAt = @event.CreatedAt,
            PaymentId = @event.PaymentId
        });

        var result = await _unitOfWork.SaveChangesAsync();

        _logger.Log(result > 0 ? LogLevel.Information : LogLevel.Error,
            "Insert Draw With PaymentId: {PaymentId} ==> {Status}",
            @event.PaymentId,
            result > 0 ? "Succeeded" : "Failed");
    }
}
