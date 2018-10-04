import { Component, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { PermissionHelper } from '../../../shared/helper/permission-helper';
@Component({
	selector: 'app-left-nav-bar',
	templateUrl: './left-nav-bar.component.html',
	styleUrls: ['./left-nav-bar.component.css']
})
export class LeftNavBarComponent implements OnInit {

	public navModels: NavModel[];
	public activeNav: NavModel;
	public activeNavParent: NavModel;
	public currentUrl: string;

	constructor(private router: Router) {
		this.loadNavBar();
	}

	ngOnInit() {
		this.navModels.forEach(nav => {
			if (nav.Route && this.router.url.includes(nav.Route)) {
				nav.IsActive = true;
				this.activeNav = nav;
				return;
			} else if (nav.childs && nav.childs.length > 0) {
				nav.childs.forEach(child => {
					if (child.Route && this.router.url.includes(child.Route)) {
						child.IsActive = true;
						this.activeNav = child;
						nav.IsActive = true;
						this.activeNavParent = nav;
						return;
					}
				})
			}
		});

		this.subscribeToRoute();
	}

	public navClick(nav: NavModel) {
		if (this.activeNavParent) this.activeNavParent.IsActive = false;
		
		this.activeNav.IsActive = false;

		nav.IsActive = true;
		this.activeNav = nav;
	}

	public navChildClick(parent: NavModel, nav: NavModel) {
		this.navClick(nav);

		parent.IsActive = true;
		this.activeNavParent = parent;
		console.log(parent.Title);
	}

	private loadNavBar(): void {
		this.navModels = [];

		// Dashboard
		this.navModels.push(new NavModel("/", "Dashboard", "fa-dashboard", null));

		// Masters.
		let masterNavs : NavModel[] = [];
		masterNavs.push(new NavModel("/manufacturers", "Manufacturers", null, null));
		masterNavs.push(new NavModel("/buyers", "Buyers", "fa-inbox", null));
		if (PermissionHelper.canAccessPricingZone()) {
			masterNavs.push(new NavModel("/pricing-zone", "Pricing Zone", null, null));
		}

		// Manage user is only accesible to Admin
		let userProfile = AuthService.getUserData();
		if (userProfile && userProfile.user.role == "admin") {
			masterNavs.push(new NavModel("/user", "Manage User", null, null));
		}

		this.navModels.push(new NavModel(
			null,
			"Masters",
			null,
			masterNavs));

		let pricingNavs : NavModel[] = [];
		if (PermissionHelper.canAccessManufacturerPricing()) {
			pricingNavs.push(new NavModel("/pricing-to-msupply", "From Manufacturers", "", null))
		}

		if (PermissionHelper.canAccessPricingToBuyer()) {
			pricingNavs.push(new NavModel("/msupply-pricing", "To Buyers", "", null));
		}

		if (pricingNavs && pricingNavs.length > 0) {
			this.navModels.push(new NavModel(
				null,
				"Pricing",
				null,
				pricingNavs));
		}

		if (PermissionHelper.canViewOrders()) {
			this.navModels.push(new NavModel(
				null,
				"Purchase Order",
				null,
				[new NavModel("/orders", "Buyer's PO", null, null)]));
		}

		this.navModels.push(new NavModel("/reports", "Reports", "fa-comments", null));
	}

	private subscribeToRoute(): void {
		this.router.events.subscribe((val) => {
			if (val instanceof NavigationEnd) {
				this.navModels.forEach(nav => {
					if (nav.Route && val.url.includes(nav.Route)) {
						this.navClick(nav);
						return;
					} else if (nav.childs && nav.childs.length > 0) {
						nav.childs.forEach(child => {
							if (child.Route && val.url.includes(child.Route)) {
								console.log("Yha to aa rha!");
								this.navChildClick(nav, child);
								return;
							}
						})
					}
				});
			}
		});
	}
}

export class NavModel {
	public Route: string;
	public Title: string;
	public Klass: string;
	public IsActive: boolean;
	public childs: NavModel[];

	constructor(route: string, title: string, klass: string, childs: NavModel[]) {
		this.Route = route;
		this.Title = title;
		this.Klass = klass;
		this.childs = childs
	}
}