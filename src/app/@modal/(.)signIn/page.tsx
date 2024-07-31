import { FunctionComponent } from "react";

import CSS from "@/styles/modal.module.scss";
import SignIn from "@/components/Auth/SignIn";
import CloseModalButton from "@/components/CloseModalButton";

interface pageProps {}

const page: FunctionComponent<pageProps> = () => {
  return (
    <div className={CSS.modal}>
      <div className={CSS.window}>
        <CloseModalButton />
        <SignIn />
      </div>
    </div>
  );
};

export default page;
