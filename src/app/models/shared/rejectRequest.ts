export class RejectRequest {
    public _id: string;
    public rejectReason : string;

    constructor(_id, rejectReason) {
        this._id = _id;
        this.rejectReason = rejectReason;
    }
}