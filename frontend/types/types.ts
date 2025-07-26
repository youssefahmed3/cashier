export type BranchType = {
  id: string;
  branch_name: string;
  location: string;
  tax: string;
  phone: string;
  slug: string;
  status: "active" | "inactive" | "under_maintenance";
};

export type EmployeeType = {

};

export type ProductType = {
  id: string;
  name: string;
  price: number;
  description: string;
  Branch: BranchType;
  barcode: string;
  imgUrl: string;
  isActive: boolean;
  createdAt: string;
  categoryId: string;
  updatedAt: string;
};


export type InventoryType = {
  id: string;
  batch_id: string;
  branch: BranchType;
  discount: boolean;
  location: string;
  qty: number;
  purchase_date: string; /* For Now */
  expiry_date: string;
};

export type Tenant = {
  id: string;
  name: string;
  email: string;
  plan: "basic" | "premium" | "enterprise";
  branches: number;
  employees: number;
  status: "active" | "inactive" | "suspended";
};

export type TenantColumn = {
  tenant: Tenant;
  plan: string;
  branches: number;
  employees: number;
  status: "active" | "suspended";
}