export class Transaction {
    constructor(
        public id: String,
        public totalItem: Number,
        public totalQTY: Number,
        public totalAmount: Number,
        public totalTaxable: Number,
        public totalCost: Number,
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

export class Purchase {
    constructor(
        public id: String,
        public billID: String,
        public totalItem: Number,
        public totalQTY: Number,
        public totalAmount: Number,
        public totalTaxable: Number,
        public totalCost: Number,
        public totalTendered: Number,
        public changeDue: Number,
        public creditAmount: Number,
        public paymentMode: String,
        public addCredit: Number,
        public salesmanID: String,
        public salesmanName: String,
        public salesmanPhone: String,
        public salesmanEmail: String,
        public userID: String,
        public userName: String,
        public createdAt: Date,
        public updatedAt: Date
    ) {
    }
}
