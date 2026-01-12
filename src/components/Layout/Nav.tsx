import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex p-2 items-center h-full">
      <Link to={"/"} className="flex justify-center items-center gap-2 px-1">
        <div className="flex items-center gap-1">
          <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
          <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
          <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
        </div>
        <span className="text-base">Aron Matoic</span>
      </Link>
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
