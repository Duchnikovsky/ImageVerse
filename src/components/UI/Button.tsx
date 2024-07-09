import React from "react";
import { Loader2 } from "lucide-react";
import CSS from "@/styles/ui.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isDisabled?: boolean;
  width?: string;
  height?: string;
  fontSize?: string;
  margin?: string | 0;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      isLoading,
      isDisabled,
      width,
      height,
      fontSize,
      margin,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={CSS.button}
        style={{
          width: width || "100%",
          height: height || "2rem",
          fontSize: fontSize || '16px',
          margin: margin,
        }}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? <Loader2 className={CSS.loader} size={fontSize} /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
