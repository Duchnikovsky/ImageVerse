import CloseModalButton from "@/components/CloseModalButton";
import Editor from "@/components/Editor";
import CSS from "@/styles/createModal.module.css";
import "@uploadthing/react/styles.css";

export default function page() {
  return (
    <div className={CSS.background}>
      <div className={CSS.container}>
        <div className={CSS.closeModal}>
          <CloseModalButton />
        </div>
        <Editor modal={true}/>
      </div>
    </div>
  );
}
