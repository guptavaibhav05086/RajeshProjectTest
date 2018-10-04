export class BankInformation{
    public _id: string;
    public accountHolderName: string;
    public accountNumber: string;
    public accountType: string;
    public ifscCode: string;
    public chequeImageUrl: string;
    public cancelledCheque:File;
    //public AccountHolderName:string;
    //public AccountNumber:string;
    public ReEnterAccountNumber:string;
    //public IFSCCode:string;
    public ACType:string[];    
    public selectedACType:string;
    public CancelledCheque:File;
    public isReenterValid:boolean;
    public isChecqueValid:boolean;
    public isChecqueSizeValid:boolean;
    validateBankInfo(){
        if(this.accountNumber != this.ReEnterAccountNumber){
            this.isReenterValid=false;
        }
        else{
            this.isReenterValid=true;
        }
    
    }
}