namespace Shared.PaymentProviders.Paymob
{
    public class PaymobCallbackOrder
    {
        public long Id { get; set; }
        public string Merchant_Order_Id { get; set; }
        public decimal Amount_Cents { get; set; }
        public decimal Paid_Amount_Cents { get; set; }
    }
}