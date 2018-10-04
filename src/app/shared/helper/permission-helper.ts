import { AuthService } from "../services/authentication/auth.service";
import { UserProfile } from "../../models/user/user-profile";
import { environment } from "../../../environments/environment";

// ********** KEEP THIS IN SYNC WITH Permissions configuration ***************** //
export class PermissionHelper {
    public static canAddEditManufacturer(): boolean {
        let userProfile: UserProfile = AuthService.getUserData();
        if (!this.hasPermission(userProfile)) {
            return false;
        }

        let requiredPermissionCode: string = this.getPermissionCode("Manufacturer", "Add/Edit Manufacturer");
        if (userProfile.user.permissions.indexOf(requiredPermissionCode) == -1) {
            return false;
        }

        return true;
    }

    public static canApproveRejectManufacturer(): boolean {
        let userProfile: UserProfile = AuthService.getUserData();
        if (!this.hasPermission(userProfile)) {
            return false;
        }

        let requiredPermissionCode: string = this.getPermissionCode("Manufacturer", "Approve/Reject Manufacturer");
        if (userProfile.user.permissions.indexOf(requiredPermissionCode) == -1) {
            return false;
        }

        return true;
    }

    public static canAddEditBuyer(): boolean {
        let userProfile: UserProfile = AuthService.getUserData();
        if (!this.hasPermission(userProfile)) {
            return false;
        }

        let requiredPermissionCode: string = this.getPermissionCode("Buyers", "Add/Edit Buyers");
        if (userProfile.user.permissions.indexOf(requiredPermissionCode) == -1) {
            return false;
        }

        return true;
    }

    public static canApproveRejectBuyer(): boolean {
        let userProfile: UserProfile = AuthService.getUserData();
        if (!this.hasPermission(userProfile)) {
            return false;
        }

        let requiredPermissionCode: string = this.getPermissionCode("Buyers", "Approve/Reject Buyers");
        if (userProfile.user.permissions.indexOf(requiredPermissionCode) == -1) {
            return false;
        }

        return true;
    }

    public static canAccessPricingZone() : boolean {
        let userProfile: UserProfile = AuthService.getUserData();
        if (!this.hasPermission(userProfile)) {
            return false;
        }

        let requiredPermissionCode: string = this.getPermissionCode("Pricing Zone", "Pricing Zone");
        if (userProfile.user.permissions.indexOf(requiredPermissionCode) == -1) {
            return false;
        }

        return true;
    }

    public static canAccessManufacturerPricing() : boolean {
        let userProfile: UserProfile = AuthService.getUserData();
        if (!this.hasPermission(userProfile)) {
            return false;
        }

        let requiredPermissionCode: string = this.getPermissionCode("Pricing", "Manufacturer Product Pricing");
        if (userProfile.user.permissions.indexOf(requiredPermissionCode) == -1) {
            return false;
        }

        return true;
    }

    public static canAccessPricingToBuyer() : boolean {
        let userProfile: UserProfile = AuthService.getUserData();
        if (!this.hasPermission(userProfile)) {
            return false;
        }

        let requiredPermissionCode: string = this.getPermissionCode("Pricing", "mSupply Pricing to Buyer");
        if (userProfile.user.permissions.indexOf(requiredPermissionCode) == -1) {
            return false;
        }

        return true;
    }

    public static canViewOrders() : boolean {
        let userProfile: UserProfile = AuthService.getUserData();
        if (!this.hasPermission(userProfile)) {
            return false;
        }

        let requiredPermissionCode: string = this.getPermissionCode("Buyer Purchase Order", "View PO");
        if (userProfile.user.permissions.indexOf(requiredPermissionCode) == -1) {
            return false;
        }

        return true;
    }

    public static canEditOrders() : boolean {
        let userProfile: UserProfile = AuthService.getUserData();
        if (!this.hasPermission(userProfile)) {
            return false;
        }

        let requiredPermissionCode: string = this.getPermissionCode("Buyer Purchase Order", "Edit PO");
        if (userProfile.user.permissions.indexOf(requiredPermissionCode) == -1) {
            return false;
        }

        return true;
    }

    public static canApproveRejectOrders() : boolean {
        let userProfile: UserProfile = AuthService.getUserData();
        if (!this.hasPermission(userProfile)) {
            return false;
        }

        let requiredPermissionCode: string = this.getPermissionCode("Buyer Purchase Order", "Approve reject PO");
        if (userProfile.user.permissions.indexOf(requiredPermissionCode) == -1) {
            return false;
        }

        return true;
    }
    private static hasPermission(userProfile: UserProfile) {
        if (!userProfile ||
            !userProfile.user ||
            !userProfile.user.permissions ||
            userProfile.user.permissions.length == 0) {
            return false;
        }

        return true;
    }

    private static getPermissionCode(permissionName: string, subPermissionName): string {
        let requiredPermissionCode: string = null;
        let permissionConfigurations = environment.permissionConfigurations;

        permissionConfigurations.forEach(configuration => {
            if (configuration.name == permissionName) {
                configuration.permissions.forEach(permission => {
                    if (permission.name == subPermissionName) {
                        requiredPermissionCode = permission.code;
                        return;
                    }
                });

                if (requiredPermissionCode) {
                    return;
                }
            }
        });

        return requiredPermissionCode;
    }
}