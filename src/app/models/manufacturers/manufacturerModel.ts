import { Proprietor } from "../Proprietor";
import { InvoiceAddress } from "../InvoiceAddress";
import { BankInformation } from "../BankInformation";
import { TermsOfTrade } from "../TermsOfTrade";
import { OtherInformation } from "../OtherInformation";
import { DocumentsAndAttachments } from "../DocumentsAndAttachments";

export class ManufacturerModel {
    _id: string;
    
    public status: string;
    public rejectReason: string;

    companyName: string;
    businessType: string;
    gstIn: string;
    cinNumber: string;
    panNumber: string;
    established: number;//difference in type
    legalStatus: string;
    websiteUrl: string;
    logoUrl: string;
    photo1Url: string;
    photo2Url: string;
    mobileNumber: number;
    landLineNumber: string;
    emailId: string;
    password: string;
    allowmSupplyToCallOrSMS: boolean;

    proprietors: Proprietor[];
    invoiceAddress: InvoiceAddress;
    bankInformation: BankInformation;
    termsOfTrade: TermsOfTrade;
    otherInformation: OtherInformation;
    documentsAndAttachments: DocumentsAndAttachments[];
    creditLimit: any;
    creditPeriod: any;

    constructor(_id: string) {
        this._id = _id;
    }
} 