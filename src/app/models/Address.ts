export class Address {
    _id: string;
    line1: string;
    line2: string;
    state: string;
    city: string;
    location: string
    pincode: number;
    createdAt: Date;
    stateId:string;
    cityId:string;

    // for Data display
    stateObj: any;
    cityObj: any;
    locationObj: any;
}