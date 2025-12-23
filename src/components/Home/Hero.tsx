const Hero = () => {
  return (
    <div className="flex flex-col justify-items-center">
      <h1 className="text-center text-text-primary">React Developer</h1>
      <h3 className="w-full text-text-secondary">
        I build modern web applications with React and TypeScript, using SCSS
        and Tailwind CSS.
      </h3>
      <div className="flex w-full justify-center gap-20 mt-3">
        <button className="btn-primary">View My Work</button>
        <button className="btn-secondary">Get In Touch</button>
      </div>
    </div>
  );
};

export default Hero;
