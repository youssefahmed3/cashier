import CustomButton from "@/components/Button/Button";
import { DataTable } from "@/components/ui/data-table";
import { Clock } from "lucide-react";
import React from "react";
import { columns } from "../_component/column";

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
]


const page = () => {
  return (
    <div className="container-base">
      <CustomButton title="Hello" icon={<Clock />} />
      asd
      <DataTable columns={columns} data={payments} />
    </div>
  );
};

export default page;
