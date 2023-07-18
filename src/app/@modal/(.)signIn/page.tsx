import { FunctionComponent } from "react";

import CSS from "@/styles/modal.module.css";
import SignIn from "@/components/SignIn";
import CloseModalButton from "@/components/CloseModalButton";

interface pageProps {}

const page: FunctionComponent<pageProps> = () => {
  return <div className={CSS.background}>
    <div className={CSS.container}>
      <div className={CSS.closeModal}>
        <CloseModalButton />
      </div>
      <SignIn />
    </div>
  </div>;
};

export default page;
