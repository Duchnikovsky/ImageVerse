import React from "react";
import { Loader2 } from 'lucide-react'
import CSS from '@/styles/ui.module.css'

interface ButtonTypes {
  width: number;
  height: number;
  text: string;
  isLoading: boolean;
  isDisabled: boolean;
}

export default function Button({ width, height, text, isLoading, isDisabled }: ButtonTypes) {
  return <button type="button" style={{ width: width, height: height }} disabled={isDisabled} className={CSS.button}>{isLoading ? <Loader2 className={CSS.loader}/> : text}</button>;
}
