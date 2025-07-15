import React from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ButtonProps {
  className?: string;
  icon?: React.ReactNode;
  title: string;
}

const CustomButton = (props: ButtonProps) => {
  return (
    <Button
      className={`cursor-pointer select-none w-fit gap-2 items-center ${props.className}`}
    >
      {props.icon || null}
      {props.title}
    </Button>
  );
};

export default CustomButton;
