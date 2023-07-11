import { FC } from "react";
import SignUp from "@/components/SignIn";
import CSS from "@/styles/auth.module.css";

const page: FC = () => {
  return (
    <div className={CSS.borderBox}>
      <SignUp />
    </div>
  );
};

export default page;
