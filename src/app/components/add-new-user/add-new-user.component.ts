import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserManagementService } from '../../services/user-management.service';
import { UserProfileService } from '../../services/user-profile.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-add-new-user',
	templateUrl: './add-new-user.component.html',
	styleUrls: ['./add-new-user.component.css']
})
export class AddNewUserComponent implements OnInit {

	@ViewChild('addUserForm') form: any;
	public permissionConfigurations = [];
	public loading: boolean = false;
	public emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	public userId: string;
	firstNameTxt: any = '';
	lastNameTxt: any = '';
	mobileNoTxt: any = '';
	emailIdTxt: any = '';
	txtpassword: any = '';
	txtconfirmPassword: any = '';
	public isActive: boolean;
	public role: string = "user";
	public isValidEmail : boolean;
	public isValidMobile : boolean;
	public permissions: Permission[];
	public permissionConfigurations2 = [];

	public allSelected = false;

	constructor(private router: Router,
		private _userManagementService: UserManagementService,
		private toast: ToastService,
		private activatedRoute: ActivatedRoute,
		private _userProfile: UserProfileService) {
		this.permissions = [];
		this.permissions.push(new Permission("Add/Edit Manufacturer", "101", false));
	}

	//#region Initialization

	ngOnInit() {
		this.isValidEmail = true;
		this.isValidMobile = true;
		this.userId = this.activatedRoute.snapshot.queryParams['id'] || null;//this._userManagementService.getUserId();
		
		//this.getPermissions();
		this.getAllPermissions2();
		this.permissionConfigurations2 = this.permissionConfigurations;
		this.resetPermissions(false)

		if (this.userId) {
			this.getUser();
		}
	}

	getUser() {
		this.loading = true;
		this._userProfile.getUserProfile(this.userId).subscribe(
			res => {
				this.loading = false

				this.firstNameTxt = res.firstName;
				this.lastNameTxt = res.lastName;
				this.emailIdTxt = res.emailId;
				this.mobileNoTxt = res.mobileNumber;
				this.isActive = res.isActive;
				this.role = res.role;
				this.mapPermissions(res.permissions);
			},
			error => {
				this.loading = false;

				let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
				this.checkUnauthorized(handledError);
			})
	}

	public getAllPermissions2() {
		this.permissionConfigurations = environment.permissionConfigurations;
	}

	private mapPermissions(userPermissions: string[]) {
		if (!userPermissions) {
			return
		}

		for (let i = 0; i < this.permissionConfigurations2.length; i++) {
			let allTrue : boolean = true;

			for (let j = 0; j < this.permissionConfigurations2[i].permissions.length; j++) {
				if (userPermissions.indexOf(this.permissionConfigurations2[i].permissions[j].code) != -1) {
					this.permissionConfigurations2[i].permissions[j].isActive = true;
				} else {
					allTrue = false;
				}
			}

			if (allTrue) {
				this.permissionConfigurations2[i].isActive = true;
			}
		}
	}
	//#endregion
	
	//#region OnChange listeners

	public permissionConfigurationChecked(permissionConfiguration, isChecked) : void {
		permissionConfiguration.isActive = isChecked
		permissionConfiguration.permissions.forEach(permission => {
			permission.isActive = isChecked;
		});

		this.updateSelection();
	}

	public configurationsChecked(isChecked) : void {
		this.permissionConfigurations2.forEach( configuration => {
			configuration.isActive = isChecked;

			configuration.permissions.forEach(permission => {
				permission.isActive = isChecked;
			});
		});

		this.allSelected = isChecked;
	}

	onCancelForm() {
		this.router.navigate(['/user']);
	}

	public onCheckboxClick(permission, isChecked) {
		permission.isActive = isChecked;

		this.updateSelection();
	}

	//#endregion

	private getUserSelectedPermissions2() : string[]{
		let userPermissions = []
		this.permissionConfigurations2.forEach( configuration => {
			configuration.permissions.forEach(permission => {
				if (permission.isActive) {
					userPermissions.push(permission.code);
				}
			});
		});

		return userPermissions;
	}

	//#region Create update User
	public createOrUpdate(addUserForm: NgForm) {
		let formvalue = addUserForm.value;
		console.log("AsssAAA");
		console.log(formvalue.role);
		console.log(this.form.valid);
		if (this.form.valid) {
			if(formvalue.role == 'admin'){
				this.resetPermissions(true);
			}
			if (this.userId) {
				let reqBody = {
					"emailId": this.emailIdTxt,
					"role": formvalue.role,
					"isActive": this.isActive,
					"permissions": this.getUserSelectedPermissions2()
				}

				console.log(reqBody)
				this.updateProfile(reqBody);
			} else {
				this.createUser(addUserForm);
			}
		}
	}

	public createUser(addUserForm: NgForm) {
		let formvalue = addUserForm.value;
		if (this.form.valid) {
			console.log()
			if (formvalue.profile.confirmPassword === formvalue.profile.password) {
				let reqBody = {
					"firstName": formvalue.profile.firstName,
					"lastName": formvalue.profile.lastName,
					"emailId": formvalue.profile.emailId,
					"password": formvalue.profile.password,
					"mobileNumber": formvalue.profile.mobileNo,
					"role": formvalue.role,
					"isActive": this.isActive,
					"permissions": this.getUserSelectedPermissions2()

				}
				console.log(reqBody)

				this.createNewUSer(reqBody);
			}else{
				this.toast.error("Password didnot match")
			}
		} else {
			this.toast.error('Please form the missing details')
		}

		console.log(formvalue);
	}

	createNewUSer(req) {
		this.loading = true;
		this._userManagementService.createNewUser(req).subscribe(
			(res) => {
				this.loading = false;
				console.log(res);
				if (!res.isValid) {
					console.log(res.errors[0]);
					this.toast.error(res.errors[0]);
				}else{
					this.toast.success('User Created Sucessfully ');
					this.router.navigate(['/user']);
				}
				
			},
			(error) => {
				this.loading = false;

				let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
				this.checkUnauthorized(handledError);
			});
	}

	updateProfile(req) {
		this.loading = true;
		this._userManagementService.updateProfile(req).subscribe(
			(res) => {
				this.loading = false;
				console.log("ANISH")
				console.log(res);
				if (!res.isValid) {
					console.log(res.errors[0]);
					this.toast.error(res.errors[0]);
				}else{
					this.toast.success('User updated Sucessfully ');
					this.router.navigate(['/user']);
				}
			},
			(error) => {
				this.loading = false;

				let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
				this.checkUnauthorized(handledError);
			});
	}

	validateEmail(){
		if(this.emailIdTxt == undefined ||  this.emailIdTxt == null || this.emailIdTxt == ""){
			this.isValidEmail = false;
			return;
		  }
	  
		  if(!this.emailPattern.test(this.emailIdTxt)){
			this.isValidEmail = false;
			return;
		  }
		  this.isValidEmail = true;
	}

	validateMobile(){
		if( this.mobileNoTxt != undefined && this.mobileNoTxt != "" &&  (this.mobileNoTxt.toString().length > 0 && this.mobileNoTxt.toString().length !=10)){
			this.isValidMobile=false;	
		}
		else{
			this.isValidMobile=true;			
		}
	}
	//#endregion

	private resetPermissions(isActive) : void {
		this.allSelected = isActive;
		this.permissionConfigurations2.forEach( configuration => {
			configuration.isActive = isActive;

			configuration.permissions.forEach(permission => {
				permission.isActive = isActive;
			});
		});
	}

	private updateSelection() : void {
		let isAllSelected : boolean = true;
		this.permissionConfigurations2.forEach( configuration => {

			let isAllChildSelected : boolean = true;
			configuration.permissions.forEach(permission => {
				if (!permission.isActive) {
					isAllChildSelected = false;
					isAllSelected = false;
					return;
				}
			});

			configuration.isActive = isAllChildSelected;
			if (!configuration.isActive) {
				isAllSelected = false;
				return;
			}
		});

		this.allSelected = isAllSelected;
	}

	//#region Error Handling
	private checkUnauthorized(handledError: HandledErrorResponse): void {
		this.toast.error(handledError.message);

		if (handledError.code == 401) {
			AuthService.logout();
			this.router.navigate(['/login']);
		}
	}

	//#endregion

	//#region Unused

	getUserSelectedPermissions(formvalue) {
		let temp = [];
		Object.keys(formvalue).forEach((obj) => {
			console.log(obj);
			if (obj != 'profile' && obj != 'role' && obj != 'selectAllRights') {
				let prpArr = formvalue[obj];
				Object.keys(prpArr).forEach((key) => {
					if (prpArr[key] == true)
						temp.push(key)
				});
			}
		})
		return temp;
	}

	getAllpermissions(formvalue) {
		let temp = [];
		Object.keys(formvalue).forEach((obj) => {
			console.log(obj);
			if (obj != 'profile' && obj != 'role' && obj != 'selectAllRights') {
				let prpArr = formvalue[obj];
				Object.keys(prpArr).forEach((key) => {

					temp.push(key)
				});
			}
		})
		return temp;
	}

	getPermissions() {
		this.loading = true;
		this._userManagementService.getPermissions().subscribe((res) => {
			console.log(res)
			this.loading = false;
			let responseProps = Object.keys(res);
			for (let prop of responseProps) {
				this.permissionConfigurations.push(res[prop]);
			}
			console.log(this.permissionConfigurations);
		}, (error) => {
			console.log(error)
		});
	}

	//#endregion
}


class Permission {
	public name: string;
	public code: string;
	public isActive: boolean;

	constructor(name, code, isActive) {
		this.name = name;
		this.code = code;
		this.isActive = isActive;
	}
}