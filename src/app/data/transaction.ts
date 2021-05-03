export class Transaction {
    constructor(
        public id: String,
        public totalItem: Number,
        public totalQTY: Number,
        public vat: Number,
        public discount: Number,
        public discountValue: Number,
        public totalAmount: Number,
        public totalTendered: Number,
        public changeDue: Number,
        public creditAmount: Number,
        public paymentMode: String,
        public addCredit: Number,
        public customerID: String,
        public customerName: String,
        public customerPhone: String,
        public customerEmail: String,
        public userID: String,
        public userName: String,
        public createdAt: Date,
        public updatedAt: Date
    ) {
    }
}