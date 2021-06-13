export class Customer {
    public label: string;
    constructor(
        public id: String,
        public name: String,
        public phone: String,
        public email: String,
        public credit: Number,
        public creditlimit: Number,
        public qty: Number,
        public amount: Number,
        public count: Number,
        public createdAt: Date,
        public updatedAt: Date
    ) {
    }
}