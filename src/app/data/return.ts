export class ReturnCreate {
    constructor(
        public id: String,
        public totalItem,
        public totalQTY,
        public totalAmount,
        public totalTendered,
        public changeDue,
        public dueAmount,
        public dueDate,
        public paymentMode,
        public addDue,
        public vendorID,
        public vendorFName,
        public vendorLName,
        public vendorCompany,
        public vendorPhone,
        public vendorEmail,
        public userID,
        public userName
    ) {
    }
}
export class ReturnItemCreate {
    constructor(
        public id: String,
        public returnid: String,
        public itemcode: String,
        public itemname: String,
        public batchno: String,
        public qtystock: Number,
        public qty: Number,
        public price: Number,
        public discount: Number,
        public discountamount: Number,
        public totalcost: Number,
        public purchasedate: Date,
        public mfg: Date,
        public expiry: Date,
        public vendorid: String,
        public reason: String
    ) {
    }
}