import { Component, OnInit } from '@angular/core';
import  { UserManagementService } from '../../services/user-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public showNewuserForm: boolean = false;
  public showEmptyForm: boolean = false;
  public showAllUsers: boolean = false;
  public admins = [];
  public isActiveAdmin: boolean;
  public searchTerm : string;
  public resArray = [];
  public loading = false;
  public searchTerm1: any;
  public userName = [];
  public modelSearch: any;
  public listUser = [];
 
  constructor(private _userManager: UserManagementService, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.getAllAdmin();  
  }


  public addNewUser() :void{
    this.router.navigate(['/user-new']);
  }

  public getAllAdmin(){
    this._userManager.getAllAdmin().subscribe((res)=>{
      console.log(res.length);
      this.loading = false;
      this.resArray = res;
      if(res.length > 0){
        this.showEmptyForm = false;
        this.showAllUsers = true;        
        this.admins = res;
        this.listUser = res;
        console.log(res);
        this.userName = this.getUserName();
        console.log('userNames', this.userName)
      }      
      else{
        this.showEmptyForm  = true;
      }
      
    },(error)=>{
      console.log(error);
    });
  }

getUserName(){  
  let temp  = this.admins.map(item => item.firstName + ' ' + item.lastName);
  return temp;
}
  onActiveChange(event){
    console.log(event)
    //;alert('changed')
  }

  searchByUserNm(searchTerm){
    let temp = [];
    if(searchTerm.length > 0){
      this.admins.filter((item)=>{
        if(item.firstName.toLowerCase() === searchTerm.toLowerCase().trim()){
          temp.push(item);
        }
      });
      this.admins = temp;
    }else{
      this.admins = this.resArray;
    }    
  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(100),
    map(term => term === '' ? [] : this.admins.filter(v => v.firstName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

formatter = (x: { firstName: string ,lastName: string}) => x.firstName + ' ' + x.lastName;

public searchSelected(event){
  console.log('searched term',event)
  console.log(event.item._id);
  this.admins = this.filterResults(event.item._id)
}

public filterResults(id){
  let temp = [];
  this.admins.filter((item) => {
    if(item._id === id)
      temp.push(item)
    }
    );
   return temp;
}

clearSearch(val) {
  this.modelSearch = null;
  this.admins = this.listUser;
}

onClickViewEdit(id){
console.log(id);
this.router.navigate(['/user-new'], { queryParams: { id: id } });
}

}

