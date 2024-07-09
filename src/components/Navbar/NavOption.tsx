import CSS from "@/styles/NavbarStyles/navbar.module.scss";

interface NavOptionProps{
  option: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function NavOption({option, icon, onClick} :NavOptionProps) {
  return (
    <div className={CSS.navOption} onClick={onClick}>
      {icon}
      <span className={CSS.optionText}>{option}</span>
    </div>
  )
}
