namespace Shared.PaymentProviders.Paymob
{
    public class PaymobTransactionObj
    {
        public long Id { get; set; }
        public bool Pending { get; set; }
        public decimal Amount_Cents { get; set; }
        public bool Success { get; set; }

        // Transaction status flags
        public bool Is_Voided { get; set; }
        public bool Is_Refunded { get; set; }

        // Essential metadata
        public int Integration_Id { get; set; }
        public PaymobCallbackOrder Order { get; set; }
        public string Currency { get; set; }

        // Status info
        public bool Error_Occured { get; set; }
        public DateTime Created_At { get; set; }

    }
}