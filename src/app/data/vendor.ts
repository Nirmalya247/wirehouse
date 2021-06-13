export class Vendor {
    public label: string;
    constructor(
        public id: String,
        public fname: String,
        public lname: String,
        public company: String,
        public phone: String,
        public email: String,
        public vatno: String,
        public due: String,
        public createdAt: Date,
        public updatedAt: Date
    ) {
    }
}