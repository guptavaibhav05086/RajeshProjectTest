import { ApiResponseBase } from "../../models/api-response-base";

export class UserProfile {
  public isvalid: boolean;
  public token: string;
  public user: User;
  public message: string;

  public constructor(response) {
    this.isvalid = response.isvalid;
    this.token = response.token;
    this.user = response.user;
  }
}

class User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNumber: string;
  isActive: boolean;
  role: string;
  permissions: string[]
}
