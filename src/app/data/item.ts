export class Item {
    constructor(
        public itemcode: String,
        public itemname: String,
        public itemtypeid: Number,
        public itemtypename: String,
        public hsn: String,
        public vat: Number,
        public discount: Number,
        public manufacturer: String,
        public description: String,
        public qty: Number,
        public price: Number,
        public totalsold: Number,
        public totalearned: Number,
        public createdAt: Date,
        public updatedAt: Date
    ) {
    }
}
export class ItemTransaction {
    constructor(
        public id: Number,
        public stockid: String,
        public itemcode: String,
        public itemname: String,
        public rack: String,
        public hsn: String,
        public qtystock: Number,
        public qty: Number,
        public price: Number,
        public discount: Number,
        public vat: Number,
        public totalprice: Number,
        public expiry: Number,
        public salesmanid: String,
        public salesmanname: String,
        public salesmanphone: String,
        public salesmanemail: String,
    ) {
    }
}
export class ItemUpdate {
    constructor(
        public id: Number,
        public purchaseId: String,
        public itemcode: String,
        public itemname: String,
        public qty: Number,
        public qtystock: Number,
        public price: Number,
        public discount: Number,
        public vat: Number,
        public cost: Number,
        public totalcost: Number,
        public expiry: String,
        public rack: String,
        public salesmanid: String,
        public description: String
    ) {
    }
}