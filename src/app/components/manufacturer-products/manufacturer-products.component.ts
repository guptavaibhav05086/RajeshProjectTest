import { Component, OnInit } from '@angular/core';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { ProductserviceService } from '../../services/productservice.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { AddEditProductModalComponent } from '../add-edit-product-modal/add-edit-product-modal.component';
import { Product, ProductsData } from '../../models/Product';
import { ProductCategory } from '../../models/ProductCategory';
import { ProductSubCategory } from '../../models/ProductSubCategory';
import { Brand } from '../../models/Brand';
import { ProductType } from '../../models/ProductType';
import { ProductDimension } from '../../models/ProductDimensions';
import { AuthService } from '../../shared/services/authentication/auth.service';

@Component({
	selector: 'app-manufacturer-products',
	templateUrl: './manufacturer-products.component.html',
	styleUrls: ['./manufacturer-products.component.css']
})
export class ManufacturerProductsComponent implements OnInit {

	public ShowManufacturerProductsPanel: boolean;
	public productData: ProductsData;
	public manufacturerId: string
	public loading: boolean;

	constructor(
		private route: ActivatedRoute,
		private productService: ProductserviceService, private toast: ToastService, private router: Router,
		private modalService: NgbModal) {

		this.manufacturerId = this.route.snapshot.queryParams['id'] || null;
	}

	ngOnInit() {
		this.ShowManufacturerProducts()
	}

	//Show Manufacturer Products Panel/Form
	ShowManufacturerProducts() {
		if (!this.manufacturerId) {
			this.toast.error("Manufacturer not defined!");
			return;
		}

		this.loading = true;
		this.productService.getProductsByManufacturer(this.manufacturerId).subscribe(res => {
			this.loading = false;
			if (!res.isValid) {
				this.toast.error(res.errors[0]);
				return;
			}
			
			this.productData = res.data;
			this.productData.products.forEach(item=> {
				if(item.status == "Active"){
					item.statusChecked = true;

				}
				else{
					item.statusChecked = false;

				}

			});

			console.log(this.productData);

			//   this.ProductData.products.forEach( product =>{

			//     product.categoryName = this.GetValueFromListById(
			//       this.ProductData.categories, 
			//       product.category);;

			//     product.subCategoryName = this.GetValueFromListById(
			//       this.ProductData.subCategories, 
			//       product.subCategory);

			//     product.brandName = this.GetValueFromListById(
			//         this.ProductData.brands, 
			//         product.brand);

			//     product.typeName = this.GetValueFromListById(
			//       this.ProductData.productTypes, 
			//       product.type);

			//   })

		},
			(error) => {
				this.loading = false;

				let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
				this.checkUnauthorized(handledError);
			}
		);
		this.ShowManufacturerProductsPanel = true;
	}

	//Show Manufacturer registartion Panel/Form
	ShowManufacturerRegistration() {
		this.router.navigate(['manufacturers-registration'], { queryParams: { id: this.manufacturerId } });
	}

	// Crate Manufacturer
	CompleteManufacturerRegistration() {

	}

	//Add Manufacturer Product
	AddNewProduct() {
		const modalRef = this.modalService.open(AddEditProductModalComponent, { size: 'lg' });
		let product = new Product();
		product.category = new ProductCategory();
		product.subCategory = new ProductSubCategory(null, null);
		product.brand = new Brand();
		product.type = new ProductType();
		product.dimension = new ProductDimension();


		try {
			//product.manufacturer ="5b393b7cf6ef9728bed19ead"; //TODO 
			modalRef.componentInstance.product = product;
			modalRef.componentInstance.categories = this.productData.categories;
			modalRef.componentInstance.subCategories = this.productData.subCategories;
			modalRef.componentInstance.productTypes = this.productData.productTypes;
			modalRef.componentInstance.brands = this.productData.brands;
			modalRef.componentInstance.manufacturerId = this.manufacturerId;
			modalRef.result.then(result => {
				debugger;
				console.log("add product")
				this.ShowManufacturerProducts();
				//this.router.navigate(['manufacturers-products'], { queryParams: { id: this.manufacturerId } });
			});
		}
		catch (err) {

		}
	}

	//Edit Manufacturer Product
	EditProduct(product) {
		try {
			const modalRef = this.modalService.open(AddEditProductModalComponent, { size: 'lg' });
			modalRef.componentInstance.product = product;
			modalRef.componentInstance.categories = this.productData.categories;
			modalRef.componentInstance.subCategories = this.productData.subCategories;
			modalRef.componentInstance.productTypes = this.productData.productTypes;
			modalRef.componentInstance.brands = this.productData.brands;
			modalRef.result.then(result => {
				console.log("edit called")
				this.ShowManufacturerProducts();
				//this.router.navigate(['manufacturers-products'], { queryParams: { id: this.manufacturerId } });
			});
		} catch (err) {

		}
	}

	//Delete Manufacturer Product
	DeleteProduct(product) {
		this.loading = true;
		this.productService.deleteProduct(product._id).subscribe(res => {
			this.loading = false;
			if (!res.isValid) {
				this.toast.error(res.errors[0]);
				return;
			}
			this.toast.success('Product deleted');
			this.ShowManufacturerProducts();	
		},
			(error) => {
				this.loading = false;
				let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
				this.checkUnauthorized(handledError);
			}
		);
	}

	//#region Error handler
	private checkUnauthorized(handledError: HandledErrorResponse): void {
		this.toast.error(handledError.message);

		if (handledError.code == 401) {
			AuthService.logout();
			this.router.navigate(['/login']);
		}
	}
	//#endregion

}
