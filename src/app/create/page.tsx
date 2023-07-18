import Editor from "@/components/Editor";
import React from "react";
import CSS from "@/styles/createModal.module.css";

export default function page() {
  return (
    <div className={CSS.main}>
      <div className={CSS.containerNoBorder}>
        <Editor modal={false} />
      </div>
    </div>
  );
}
