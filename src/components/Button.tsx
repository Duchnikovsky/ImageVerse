import React from "react";
import { Loader2 } from 'lucide-react'
import CSS from '@/styles/ui.module.css'

interface ButtonTypes {
  width: number;
  height: number;
  text: string;
  isLoading: boolean;
  isDisabled: boolean;
  type?: "button" | "submit" | "reset" | undefined,
}

export default function Button({ width, height, text, isLoading, isDisabled, type }: ButtonTypes) {
  return <button style={{ width: width, height: height }} type={type} disabled={isDisabled} className={CSS.button}>{isLoading ? <Loader2 className={CSS.loader}/> : text}</button>;
}
