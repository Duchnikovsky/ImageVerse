import { FC } from "react";
import SignIn from "@/components/Auth/SignIn";
import CSS from "@/styles/auth.module.scss";

const page: FC = () => {
  return (
    <div className={CSS.signInPage}>
      <SignIn />
    </div>
  );
};

export default page;
