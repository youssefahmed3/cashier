namespace Shared.Events
{
    public class DrawerLogEvent
    {
        public long? Id { get; set; }
        public decimal Amount { get; set; }
        public string TransactionType { get; set; }
        public string? Reference { get; set; }
        public DateTime? CreatedAt { get; set; }
        public long ShiftId { get; set; }
        public long BranchId { get; set; }
        public long? PaymentId { get; set; }

        //TODO: think if you need cashierId or orderId in drawerLog 

    }
}