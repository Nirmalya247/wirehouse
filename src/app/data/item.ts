export class Item {
    constructor(
        public itemcode: Number,
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