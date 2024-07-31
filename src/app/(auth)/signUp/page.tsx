import { FC } from "react";
import SignUp from "@/components/Auth/SignIn";
import CSS from "@/styles/auth.module.scss";

const page: FC = () => {
  return (
    <div className={CSS.borderBox}>
      <SignUp />
    </div>
  );
};

export default page;
