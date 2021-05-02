export class Auth {
    constructor(
        public id: Number,
        public phoneno: Number,
        public otherphoneno: Number,
        public email: String,
        public isadmin: Number,
        public active: Number,
        public deleted: Number,
        public name: String,
        public pincode: String,
        public address: String,
        public createdAt: Date,
        public updatedAt: Date
    ) {
    }
}