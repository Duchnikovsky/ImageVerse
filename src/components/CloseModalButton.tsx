"use client"
import CSS from "@/styles/modal.module.css";
import { useRouter } from "next/navigation";

export default function CloseModalButton() {
  const router = useRouter()
  return (
    <div className={CSS.closeButton} onClick={() => router.back()}>
      X
    </div>
  )
}
