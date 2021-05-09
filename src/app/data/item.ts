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
        public dealername: String,
        public dealerphone: String,
    ) {
    }
}