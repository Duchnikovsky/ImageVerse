import { FC } from "react";
import SignIn from "@/components/SignIn";
import CSS from "@/styles/auth.module.css";

const page: FC = () => {
  return (
    <div className={CSS.borderBox}>
      <SignIn />
    </div>
  );
};

export default page;
