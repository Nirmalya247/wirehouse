export class Item {
    constructor(
        public itemcode: String,
        public itemname: String,
        public itemtypeid: Number,
        public itemtypename: String,
        public hsn: String,
        public vat: Number,
        public discount: Number,
        public discountamount: Number,
        public manufacturer: String,
        public description: String,
        public qty: Number,
        public price: Number,
        public totalsold: Number,
        public totalearned: Number,
        public lowlimit: Number,
        public createdAt: Date,
        public updatedAt: Date
    ) {
    }
}
export class ItemSale {
    constructor(
        public id: String,
        public stockid: String,
        public stockcode: String,
        public itemcode: String,
        public itemname: String,
        public rack: String,
        public hsn: String,
        public qtystock: Number,
        public cost: Number,
        public qty: Number,
        public price: Number,
        public discount: Number,
        public discountamount: Number,
        public vat: Number,
        public totalprice: Number,
        public mfg: String,
        public expiry: String,
        public vendorid: String,
        public vendorfname: String,
        public vendorlname: String,
        public vendorcompany: String,
        public vendorphone: String,
        public vendoremail: String,
    ) {
    }
}
export class ItemUpdate {
    constructor(
        public id: String,
        public stockid: String,
        public purchaseId: String,
        public itemcode: String,
        public itemname: String,
        public qty: Number,
        public qtystock: Number,
        public price: Number,
        public discount: Number,
        public discountamount: Number,
        public vat: Number,
        public cost: Number,
        public totalcost: Number,
        public mfg: String,
        public expiry: String,
        public rack: String,
        public vendorid: String,
        public description: String
    ) {
    }
}