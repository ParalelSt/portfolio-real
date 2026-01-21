import ContactForm from "@/components/Contact/ContactForm";
import ContactInfo from "@/components/Contact/ContactInfo";

const Contact = () => {
  return (
    <div className="flex flex-col w-full min-h-full mb-auto p-1 pt-5">
      <h2>Contact Me</h2>
      <div className="flex flex-col md:flex-row gap-7 mt-3 md:mt-7">
        <div className="flex flex-col w-full md:w-md lg:w-200">
          <p className="text-base md:text-md leading-base md:leading-md font-semi-bold">
            Have a question or want to work together? I'm always open to new
            opportunities. Feel free to reach out and I'll get back to you as
            soon as possible.
          </p>
          <ContactForm className="mt-3" />
        </div>
        <div className="flex mt-2 lg:mt-0 items-start">
          <ContactInfo className="w-full md:w-sm lg:max-w-lg" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
