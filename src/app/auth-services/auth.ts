export class Auth {
    constructor(
        public id: Number,
        public phoneno: Number,
        public email: String,
        public name: String,
        public isadmin: Number,
        public createdAt: Date,
        public updatedAt: Date
    ) {
    }
}