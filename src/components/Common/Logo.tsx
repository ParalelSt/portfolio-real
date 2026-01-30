import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to={"/"}
      className="absolute flex justify-center items-center px-1 h-full tracking-tight text-logo font-extrabold text-accent"
    >
      A<span>M</span>
    </Link>
  );
};

export default Logo;
