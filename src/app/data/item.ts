export class Item {
    constructor(
        public itemcode: String,
        public itemname: String,
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
        public itemcode: String,
        public itemname: String,
        public qtyAvailable: Number,
        public price: Number,
        public qty: Number,
        public totalPrice: Number,
    ) {
    }
}