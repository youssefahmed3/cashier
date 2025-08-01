
export type Role = "superadmin" | "admin" | "employee" | "cashier";

export type UserType = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  isSuspended: boolean;
  phoneNumber: string;
  roles: Role[];
};

export type FullUserType = {
  user: UserType;
  tenant: Tenant | null;
  // inventory: InventoryType[]
};

export type BranchType = {
  id: string;
  name: string;
  phone: string;
  location: string;
  tax_percentage: number;
  tenant_id: string;
  created_at: string;
  // status: "active" | "inactive" ;
};

export type Tenant = {
  id: string;
  name: string;
  branches: BranchType[];
  is_active: boolean;
  logo_url: string;
  created_at: string;
  /* plan: "basic" | "premium" | "enterprise"; */
  /* status: "active" | "inactive" | "suspended"; */
};

export type tenantPaginated = {
  content: Tenant[];
  page: number;
  size: number;
  total_pages: number;
  total_elements: number;
  last: boolean;
  first: boolean;
  sort: string[];
  number_of_elements: number;
}

/* {
    "content": [],
    "pageable": {
        "page_number": 0,
        "page_size": 20,
        "sort": [
            {
                "direction": "DESC",
                "property": "createdAt",
                "ignore_case": false,
                "null_handling": "NATIVE",
                "ascending": false,
                "descending": true
            }
        ],
        "offset": 0,
        "paged": true,
        "unpaged": false
    },
    "total_pages": 0,
    "total_elements": 0,
    "last": true,
    "size": 20,
    "number": 0,
    "sort": [
        {
            "direction": "DESC",
            "property": "createdAt",
            "ignore_case": false,
            "null_handling": "NATIVE",
            "ascending": false,
            "descending": true
        }
    ],
    "number_of_elements": 0,
    "first": true,
    "empty": true
} */

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


export type TenantColumn = {
  tenant: Tenant;
  plan: string;
  branches: number;
  employees: number;
  status: "active" | "suspended";
}

export interface Category {
  id: number;
  name: string;
  description: string;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  barcode: string;
  imgurl: string;
  isactive: boolean;
  categoryId?: number;
}



export interface validateTokenResult {
  success: boolean,
  message: string
  claims?: {
    userId: string,
    email: string,
    roles: string,
    expiration: string
  }
}