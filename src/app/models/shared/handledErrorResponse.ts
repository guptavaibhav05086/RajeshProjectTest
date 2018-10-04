export class HandledErrorResponse {
    public code: number;
    public message: string;

    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}