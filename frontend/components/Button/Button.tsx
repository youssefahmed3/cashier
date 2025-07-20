import React from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ButtonProps {
  className?: string;
  icon?: React.ReactNode;
  title: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  form?: string; // <-- add form prop
}

const CustomButton = (props: ButtonProps) => {
  return (
    <Button
      className={`cursor-pointer select-none w-fit gap-2 items-center ${props.className}`}
      type={props.type || "button"}
      onClick={props.onClick}
      form={props.form} // <-- pass form prop
    >
      {props.icon || null}
      {props.title}
    </Button>
  );
};

export default CustomButton;
