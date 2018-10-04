 namespace RequestMapping {

    export interface Address {
        _id: string;
        line1: string;
        line2: string;
        state: string;
        city: string;
        pincode: string;
        createdAt: Date;
    }

    export interface Proprietor {
        _id: string;
        name: string;
        dateOfBirth: string;
        emailId: string;
        mobileNumber: string;
        address: Address;
    }

    

    export interface ContactPerson {
        _id: string;
        name: string;
        designation: string;
        mobileNumber: string;
        landLineNumber: string;
        emailId: string;
    }

    export interface DeliveryAddress {
        _id: string;
        address: Address;
        contactPerson: ContactPerson;
    }

    export interface InvoiceAddress {
        _id: string;
        line1: string;
        line2: string;
        state: string;
        city: string;
        pincode: string;
        createdAt: Date;
    }

    export interface BankInformation {
        _id: string;
        accountHolderName: string;
        accountNumber: string;
        accountType: string;
        ifscCode: string;
        chequeImageUrl: string;
    }

    export interface TermsOfTrade {
        _id: string;
        numberOfBlankChequeReceived: number;
        chequeNumber: string;
        chequeDate: Date;
        modeOfPaymentDetails: string;
        authorizeMSupply: boolean;
        nameOfCommonPartner: string;
        creditLimit: number;
        creditPeriod: number;
    }

    export interface Request {
        status: string;
        
        _id: string;
        companyName: string;
        businessType: string;
        gstIn: string;
        cinNumber: string;
        panNumber: string;
        established: number;
        legalStatus: string;
        websiteUrl: string;
        logoUrl: string;
        photo1Url: string;
        photo2Url: string;
        loanAssistanceRequired: boolean;
        loanAmount?: any;
        mobileNumber: string;
        landLineNumber: string;
        emailId: string;
        mobileAppPassword: string;
        allowmSupplyToCallOrSMS: boolean;
        proprietors: Proprietor[];
        deliveryAddresses: DeliveryAddress[];
        invoiceAddress: InvoiceAddress;
        bankInformation: BankInformation;
        termsOfTrade: TermsOfTrade;
        otherInformation?: any;
        documentsAndAttachments?: any;
        createdAt: Date;
        __v: number;
    }

    export interface RootObject {
        api: string;
        request: Request;
    }

}

