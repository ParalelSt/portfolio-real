import { Link } from "react-router-dom";

const About = () => {
  const techStacks = [
    {
      name: "Frontend",
      tools: ["React", "Javascript", "Typescript", "SCSS", "Tailwind"],
    },

    {
      name: "Backend",
      tools: ["Node.js", "Express", "NestJS"],
    },

    {
      name: "Tools & Platforms",
      tools: ["Git", "Vite", "Vercel", "Supabase"],
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-full mb-auto p-1 pt-5">
      <h2>About Me</h2>

      <div className="flex flex-col lg:flex-row gap-5 mt-5 md:mt-7 w-full ">
        <div className="flex lg:flex-1 justify-center items-center lg:w-full h-full md:h-160 lg:h-full overflow-hidden aspect-square">
          <img
            className="w-full h-full object-cover"
            src="../images/Profile.jpg"
            alt="profile"
          />
        </div>
        <div className="flex lg:flex-2 flex-col gap-5">
          <div className="flex flex-col gap-5 w-full h-full overflow-hidden lg:p-5 lg:border-2 lg:border-accent lg:rounded-sm">
            <div className="flex flex-col gap-1">
              <h3 className="text-md md:text-lg font-bold">Aron Matoic</h3>
              <span className="text-base md:text-md leading-base font-semi-bold">
                Full-Stack Web Developer
              </span>
              <span className="text-base md:text-md leading-base font-semi-bold">
                Križevci, Croatia &middot; CET / CEST (UTC+1 / UTC+2)
              </span>
            </div>
            <p className="text-base md:text-md leading-base font-semi-bold">
              I’m a full-stack web developer with a strong focus on frontend
              development. I enjoy building clean, responsive, and user-friendly
              interfaces, primarily working with React and TypeScript.
            </p>
            <p className="text-base md:text-md leading-base font-semi-bold">
              I like combining solid logic with thoughtful UI design, while
              continuously expanding my backend knowledge to build more complete
              applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {techStacks.map((t) => (
              <div className="flex flex-col gap-1">
                <h3>{t.name}</h3>
                <div className="flex flex-wrap gap-1">
                  {t.tools.map((tool) => (
                    <span className="p-2 border-1 border-border rounded-xl text-sm sm-custom:text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <span className="text-base md:text-md italic">
            Currently learning NestJS to build better server-side application
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Link
          className="mt-5 px-2 py-1 text-md max-w-full md:max-w-100 border-2 border-accent rounded-xs bg-accent btn-highlight"
          to={"/contact"}
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
};

export default About;
