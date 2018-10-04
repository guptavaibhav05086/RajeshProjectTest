import { Component, OnInit, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseOrderServiceService } from '../../services/purchase-order-service.service';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ToastService } from '../../shared/services/toast/toast.service';
import { connect } from 'tls';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { PermissionHelper } from '../../shared/helper/permission-helper';
import { PaginationService } from '../../shared/helper/pagination-helper';
import { Utils } from '../../shared/helper/utils';

@Component({
	selector: 'app-buyers-purchase-order',
	templateUrl: './buyers-purchase-order.component.html',
	styleUrls: ['./buyers-purchase-order.component.css']
})
export class BuyersPurchaseOrderComponent implements OnInit {

	dtOptions: DataTables.Settings = {};

	public buyer = 'All Buyers';
	public manufacturer = 'All Manufacturers';
	public status = 'All Status';
	public Location = 'All Location';
	public orderdateFrom;
	public orderdateTo;
	public btnFilter = 'Apply Filters';
	public modelSearch: any;
	public showGrid: boolean = false;
	public OriginalBuyersPOs;
	public purchaseRes;
	public FilteredBuyersPOs;
	public buyers = [];
	public manufacturers;
	public modalData = {};
	public changeOrderStatusData = {};
	public newStatus = 'Select Status';
	public showEmptyForm: boolean = false;
	public showBuyersOrderList: boolean = false;
	public loading = false;
	public modalRef: NgbModalRef;
	public modalRefRemarks: NgbModalRef;
	public sdatePipe;
	public remarks: any;
	public orderIdUpdateStatus: any;
	public locations = [];
	// array of all items to be paged
	public allItems: any[];
	   // pager object
	public pager: any = {};
	// paged items
    public pagedItems: any[];

	public canEdit: boolean;

	public inrFormatter = Utils.formatAmountInINR;

	constructor(private router: Router,
		private el: ElementRef,
		private _service: PurchaseOrderServiceService,
		private modalService: NgbModal,
		private datePipe: DatePipe,
		private activatedRoute: ActivatedRoute,
		private toastService: ToastService, 
		private paginationService: PaginationService) { }

	ngOnInit() {
		this.canEdit = PermissionHelper.canEditOrders();
		this.status = this.activatedRoute.snapshot.queryParams['status'] || 'All Status';

		this.getOrder();
		// this.dtOptions = {
		// 	pagingType: 'full_numbers',
		// 	pageLength: 10,
		// 	search: false,
		// };
	}

	getOrder() {
		this.loading = true;
		this._service.getOrder().subscribe(
			data => {
				this.loading = false;
				if (!data.isValid) {
					this.toastService.error(data.errors[0]);
					return;
				}
				if (data.data.orders.length > 0) {

					this.showEmptyForm = false;
					this.showBuyersOrderList = true;
					for (var i = 0; i < data.data.orders.length; i++) {
						for (var j = 0; j < data.data.orders[i].buyer.deliveryAddresses.length; j++) {
							if (data.data.orders[i].buyer.deliveryAddresses[j]._id == data.data.orders[i].deliveryAddressId) {
								data.data.orders[i].deliveryAddressId = data.data.orders[i].buyer.deliveryAddresses[j].address.locationObj.name
							}
						}
					}
					this.OriginalBuyersPOs = data.data.orders;
					this.FilteredBuyersPOs = data.data.orders;
					// set items to json response
					this.allItems = data.data.orders;

					 // initialize to page 1
					this.setPage(1);

					this.getLocation();
					this.buyers = data.data.buyers;
					this.manufacturers = data.data.manufacturers;

					this.showGrid = true;


					if (this.status != 'All Status') {
						this.onFilterChange()
					}
				} else {
					this.showBuyersOrderList = false;
					this.showEmptyForm = true;
				}
			},
			error => {
				this.loading = false;

				let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
				this.checkUnauthorized(handledError);
			}
		);
	}

	setPage(page: number) {
		console.log(page);
        // get pager object from service
        this.pager = this.paginationService.getPager(this.FilteredBuyersPOs.length, page);
		console.log(this.pager);
        // get current page of items
		this.pagedItems = this.FilteredBuyersPOs.slice(this.pager.startIndex, this.pager.endIndex + 1);
		console.log(this.pagedItems)
    }

	getLocation() {
		this._service.getLocations().subscribe(
			location => {
				if (!location.isValid) {
					this.toastService.error(location.errors[0]);
					return;
				}
				var temp = [];
				for (var i = 0; i < this.FilteredBuyersPOs.length; i++) {
					for (var j = 0; j < location.data.length; j++) {
						if (this.FilteredBuyersPOs[i].deliveryAddressId == location.data[j].name) {
							temp.push(location.data[j])
						}
					}
				}
				this.locations = this.removeDuplicateUsingFilter(temp);
			},
			error => {
				let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
				this.checkUnauthorized(handledError);
			}
		)
	}

	removeDuplicateUsingFilter(arr){
		let unique_array = arr.filter(function(elem, index, self) {
			return index == self.indexOf(elem);
		});
		return unique_array
	}

	onPONumberClick(poNmbr) {
		console.log(poNmbr)
		let orderId = this.getOrderId(poNmbr);
		console.log(orderId);
		if (orderId != null && orderId != '')
			this.router.navigate(['/orders-details'], { queryParams: { id: orderId } });
	}


	viewRemarks(viewRemark, orderdate, orderNumber, remarks, id) {
		
		this.remarks = remarks;
		this.orderIdUpdateStatus = id;
		console.log(id);
		this.modalRef = this.modalService.open(viewRemark, { centered: true });
		this.modalData = {
			'orderDate': new Date(orderdate), 'orderNumber': orderNumber, 'remarks': remarks
		}
		console.log(this.modalData)
		// this.modalService.open(viewRemark, { centered: true }).result.then((result) => {
		// 	console.log(result);
		// 	alert('success');

		// 	this.getOrder();
		// }, (reason) => {
		// 	console.log(reason);
		// })

	}
	updateRemarks() {
		this.loading = true;
		let req = {
			'_id': this.orderIdUpdateStatus,
			'remarks': this.remarks
		}
		this._service.updateRemarks(req).subscribe(
			(res) => {
				this.loading = false;
				console.log(res);

				if (res.isValid) {
					this.toastService.success('Remarks updated successfully');
					this.modalRef.close();
					this.getOrder();
				} else {
					this.toastService.error(res.errors[0]);
					this.modalRefRemarks.close();
				}
			},
			error => {
				this.loading = false;

				let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
				this.checkUnauthorized(handledError);
			}
		);
	}



	changeOrderStatus(changeStatus, orderDate, orderNumber, status, orderId) {
		this.changeOrderStatusData = {
			'orderDate': new Date(orderDate),
			'orderNumber': orderNumber,
			'status': status,
			'orderId': orderId
		}
		console.log(this.changeOrderStatusData);
		this.modalRef = this.modalService.open(changeStatus, { centered: true });

	}

	updateStatus(orderId) {
		this.loading = true;
		this._service.updateOrderStatus(this.newStatus, orderId).subscribe(
			res => {
				this.loading = false;
				if (!res.isValid) {
					this.toastService.error(res.errors[0]);
					return;
				}

				this.modalRef.close();
				this.getOrder();
				this.toastService.success('Order Status Updated Successfuly');
			},
			error => {
				this.loading = false;

				let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
				this.checkUnauthorized(handledError);
			}
		)
	}

	getOrderId(poNmbr) {
		let id = '';
		this.FilteredBuyersPOs.filter((item) => {
			if (item['orderNumber'] == poNmbr)
				id = item['_id'];
		});
		return id;
	}

	/**
	 * @Function for search @param search text 
	 * 
	 */

	search = (text$: Observable<string>) =>
		
		text$.pipe(
			debounceTime(100),
			map(term => term === '' ? [] : this.OriginalBuyersPOs.filter(v => v.orderNumber.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
		);
		

	formatter = (x: { orderNumber: string }) => x.orderNumber;

	searchSelected(event) {
		console.log(event.item)
		this.FilteredBuyersPOs = [event.item];
		console.log("111")
		console.log(this.FilteredBuyersPOs);
		this.setPage(1);
		
	}

	clearSearch(val) {
		this.modelSearch = null;
		this.FilteredBuyersPOs = this.OriginalBuyersPOs;
		this.showEmptyForm = false;
		if (val == 0) {
			this.buyer = 'All Buyers'
			this.manufacturer = 'All Manufacturers'
			this.status = 'All Status'
			this.Location = 'All Location'
			this.orderdateFrom = undefined
			this.orderdateTo = undefined
		}

		this.setPage(1);
	}


	onFilterChange() {

		//reset search

		this.modelSearch = null;
		
		this.FilteredBuyersPOs = this.OriginalBuyersPOs;
		if (this.FilteredBuyersPOs.length != 0) {
			let filterArray = {};
			if (this.buyer != 'All Buyers') {
				filterArray['Buyer'] = this.buyer;
			}

			if (this.manufacturer != 'All Manufacturers') {
				filterArray['companyName'] = this.manufacturer;
			}

			if (this.status != 'All Status') {
				filterArray["status"] = this.status;
			}
			if (this.Location != 'All Location') {
				filterArray["deliveryAddressId"] = this.Location;
			}

			if (this.orderdateFrom != undefined) {
				console.log("ANIS")
				console.log(this.orderdateFrom)
				filterArray["orderdateFrm"] = this.orderdateFrom;
			}

			if (this.orderdateTo != undefined) {
				filterArray["orderdateTo"] = this.orderdateTo;
			}
			//console.log(filterArray);

			if (filterArray.hasOwnProperty('Buyer')) {
				this.FilteredBuyersPOs = this.filter('BuyerName', filterArray["Buyer"]);
			}

			if (filterArray.hasOwnProperty('companyName')) {
				this.FilteredBuyersPOs = this.filter('ManufacturerName', filterArray["companyName"]);
			}

			if (filterArray.hasOwnProperty('deliveryAddressId')) {
				this.FilteredBuyersPOs = this.filter('deliveryAddressId', filterArray["deliveryAddressId"]);
			}

			if (filterArray.hasOwnProperty('status')) {
				this.FilteredBuyersPOs = this.filter('status', filterArray["status"]);
			}
			if (filterArray.hasOwnProperty('orderdateFrm') || filterArray.hasOwnProperty('orderdateTo')) {
				this.FilteredBuyersPOs = this.filterDates('orderDate', filterArray["orderdateFrm"], filterArray["orderdateTo"]);
			}

		} else {
			this.FilteredBuyersPOs = this.OriginalBuyersPOs;
		}
		this.setPage(1);
	}

	public filter(keyVal, val) {
		let temp = [];
		if (keyVal == 'BuyerName') {
			this.FilteredBuyersPOs.filter((o) => {
				let buyerNm = o['buyer'];
				if (buyerNm['companyName'] === val)
					temp.push(o)
			});
		} else if (keyVal == 'ManufacturerName') {
			this.FilteredBuyersPOs.filter((o) => {
				let manfactrNm = o['manufacturer'];
				if (manfactrNm['companyName'] === val)
					temp.push(o)
			});

		} else {
			this.FilteredBuyersPOs.filter((o) => {
				if (o[keyVal] === val)
					temp.push(o)
			});

		}
		return temp;
	}

	public filterDates(keyVal, val, todate) {
		let temp = [];
		let frmDate;
		let tooDate;
		if (val != undefined) {
			// frmDate = this.getDateValue(val);
			frmDate = val;
			console.log("QQQQ")
		}
		if (todate != undefined) {
			// tooDate = this.getDateValue(todate)
			tooDate = todate;
			console.log("PPPPP")
		}
		this.FilteredBuyersPOs.forEach((item) => {
			if(item[keyVal] != null && item[keyVal] != undefined){
				//order date
				var createDate = this.getDateValue(item[keyVal]);
				
				

				var createDate1 = (createDate.getMonth()+1) + "-"+ createDate.getDate() + "-" + createDate.getFullYear();
				var todate1 ;
				if(todate != undefined){
					console.log("Valid1111")
					todate = new Date(todate)
					todate1 = (todate.getMonth()+1) + "-"+ todate.getDate() + "-" + todate.getFullYear();
				}

				var frmDate1;
				if(frmDate != undefined){
					frmDate = new Date(frmDate)
					console.log("Valid2222")
					frmDate1 = (frmDate.getMonth()+1) + "-"+ frmDate.getDate() + "-" + frmDate.getFullYear();
				}
				

				console.log("ALL DAtes")
				console.log(createDate1);
				console.log(todate1);
				console.log(frmDate1);
				// console.log("ss")
				// console.log(new Date(createDate))
				// console.log(new Date(todate));
				// console.log(new Date(frmDate))

				if (frmDate1 != undefined && todate1 != undefined) {
					if (new Date(createDate1) >= new Date(frmDate1) && new Date(createDate1) <= new Date(todate1)) {
						temp.push(item)
					}
				}
				else if (frmDate1 != undefined && new Date(createDate1) >= new Date(frmDate1)) {
					temp.push(item)
				}
				else if (todate1 != undefined && new Date(createDate1) <= new Date(todate1)) {
					temp.push(item)
				}
			}
		});
		console.log("LIST");
		console.log(temp);
		return temp;
	}


	searchByPONumber(ponumber) {
		console.log(ponumber);
		if (ponumber != '' && ponumber != undefined && ponumber != null && ponumber.trim() != '') {
			this.FilteredBuyersPOs = this.filterByPoNbr(ponumber);
			this.setPage(1)
		}
		else {
			// this.BuyersPOs = this.gBuyersPOs;
			//this.showEmptyForm = true;
			
		}

	}
	filterByPoNbr(ponumber) {
		let temp = [];
		this.FilteredBuyersPOs.filter((item) => {
			if (item.orderNumber.toLowerCase().trim() === ponumber.toLowerCase().trim())
				temp.push(item)
		});
		return temp;
	}

	getDateValue(date: any): Date {
		console.log("LLL")
		let start = date.split('-');
		let time = start[2].split('T')[1];
		start[2] = start[2].split('T')[0];
		let hour = 0;
		let minute = 0;
		let secs = 0;

		if (time != null) {
			let timeArray = time.split(":");
			if (timeArray[0] != null && timeArray[0] != undefined) {
				hour = timeArray[0];
			}
			if (timeArray[1] != null && timeArray[1] != undefined) {
				minute = timeArray[1];
			}
			if (timeArray[2] != null && timeArray[2] != undefined) {
				secs = timeArray[2].split('.')[0];
			}


		}


		let dateStart = new Date(parseInt(start[0]), (parseInt(start[1]) - 1), parseInt(start[2]), hour, minute, secs);
		return dateStart;
	}

	//#region Error handler
	private checkUnauthorized(handledError: HandledErrorResponse): void {
		this.toastService.error(handledError.message);

		if (handledError.code == 401) {
			AuthService.logout();
			this.router.navigate(['/login']);
		}
	}
	//#endregion

}
