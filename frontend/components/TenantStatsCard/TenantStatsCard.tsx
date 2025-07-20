import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, TrendingUp } from "lucide-react";


interface TenantStatsCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    
}

const TenantStatsCard = (props: TenantStatsCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
        {props.icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{props.value}</div>
 {/*        <p className="text-xs text-muted-foreground flex items-center">
          <TrendingUp className="h-3 w-3 mr-1 text-green-500" /> this is Up
        </p>
  */}     </CardContent>
    </Card>
  );
};

export default TenantStatsCard;
