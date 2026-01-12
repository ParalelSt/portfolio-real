import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col justify-items-center">
      <h1 className="text-center text-text-primary">
        Hi, I am <span className="accent">Aron</span>!
      </h1>
      <h3 className="w-full text-text-secondary">
        I build modern, scalable web applications with React and TypeScript,
        focusing on performance and clean UI.
      </h3>
      <div className="flex w-full justify-center gap-10 lg:gap-20 mt-3">
        <Link to={"/projects"} className="btn-primary">
          View My Work
        </Link>
        <Link to={"/about"} className="btn-secondary">
          More About Me
        </Link>
      </div>
    </div>
  );
};

export default Hero;
