import PostCreator from "@/components/PostCreator";
import React from "react";
import CSS from "@/styles/modal.module.scss";

export default function page() {
  return (
    <div className={CSS.creatorPage}>
      <PostCreator modal={false} />
    </div>
  );
}
