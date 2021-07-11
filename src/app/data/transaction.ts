export class Sale {
    constructor(
        public id: String,
        public key: String,
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
        public dueAmount: Number,
        public paymentMode: String,
        public addDue: Number,
        public vendorID: String,
        public vendorFName: String,
        public vendorLName: String,
        public vendorCompany: String,
        public vendorPhone: String,
        public vendorEmail: String,
        public userID: String,
        public userName: String,
        public createdAt: Date,
        public updatedAt: Date
    ) {
    }
}
