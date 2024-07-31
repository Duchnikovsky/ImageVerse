import CloseModalButton from "@/components/CloseModalButton";
import PostCreator from "@/components/PostCreator";
import CSS from "@/styles/modal.module.scss";
import "@uploadthing/react/styles.css";

export default function page() {
  return (
    <div className={CSS.modal}>
      <div className={CSS.window}>
        <CloseModalButton />
        <PostCreator modal={true} />
      </div>
    </div>
  );
}
