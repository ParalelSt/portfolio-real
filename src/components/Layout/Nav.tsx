import { Link, useLocation } from "react-router-dom";
import Logo from "../Common/Logo";

const Nav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="relative flex p-2 items-center h-full">
      <Logo />
      <img src="../../public/images/AM.svg" alt="" />
      <div className="flex justify-center ml-auto">
        <Link
          className={`px-1.5 py-1 text-base accent ${
            isActive("/projects") ? "nav-link" : ""
          }`}
          to={"/projects"}
        >
          Projects
        </Link>
        <Link
          className={`px-1.5 py-1 text-base accent ${
            isActive("/about") ? "nav-link" : ""
          }`}
          to={"/about"}
        >
          About
        </Link>
        <Link
          className={`px-1.5 py-1 text-base accent ${
            isActive("/contact") ? "nav-link" : ""
          }`}
          to={"/contact"}
        >
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
