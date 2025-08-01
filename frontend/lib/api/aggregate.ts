/* GET: Full User Data */

import { BranchType, FullUserType, Tenant, UserType } from "@/types/types";
import { fetchUser, getTenantId } from "./auth";
import { getTenantById, getTenantWithBranches, getUserTenant } from "./tenant";


/* 
    1- First the regular user will register and verify his/her account

    2- when he login the user must first choose a plan and buy for it 

    3- after that the superadmin should create a tenant for him/her 

    4- superadmin assign the regular user to the tenant ⇒ in this we must add the tenant id so we can access it later

    5- now the user is assigned to the tenant as admin
*/


export async function getFullUserData(token: string) {

    // Getting The auth data
    const userData = await fetchUser(token) as UserType;

    // Getting the tenant id assosiated with the user
    const isAdmin = userData.roles.includes("admin");

    if (isAdmin) {
        // normal for user 
        const userTenant = await getTenantId(token) as {
            tenantId: string;
            userId: string;
        }

        // getting tenant with all the branches
        const tenantWithBranches = await getTenantWithBranches(userTenant.tenantId, token) as Tenant;

        console.log({
            user: userData,
            tenant: tenantWithBranches
        } as FullUserType);

        return {
            user: userData,
            tenant: tenantWithBranches
        } as FullUserType;
    }
    console.log({
        user: userData,
        tenant: null
    } as FullUserType);

    return {
        user: userData,
        tenant: null
    } as FullUserType;

}