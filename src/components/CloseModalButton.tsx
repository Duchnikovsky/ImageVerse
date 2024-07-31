"use client"
import CSS from "@/styles/modal.module.scss";
import { useRouter } from "next/navigation";

export default function CloseModalButton() {
  const router = useRouter()
  return (
    <div className={CSS.close} onClick={() => router.back()}>
      <span>✖</span>
    </div>
  )
}
