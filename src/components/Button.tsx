import React from "react";
import { Loader2 } from "lucide-react";
import CSS from "@/styles/ui.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  isDisabled: boolean;
  width: string;
  height: string;
  fontSize: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, isLoading, isDisabled, width, height, fontSize, ...props },
    ref
  ) => {
    return (
      <button
        className={CSS.button}
        style={{ width: width, height: height, fontSize: fontSize }}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? <Loader2 className={CSS.loader} size={fontSize}/> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
