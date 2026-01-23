import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import Container from "../Layout/Container";

interface ContactFormProps {
  className?: string;
}

const ContactForm = ({ className }: ContactFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);

    emailjs
      .sendForm(
        "service_ia74sil",
        "template_g0jpydr",
        formRef.current,
        "aljzdYTLHXBa2O_0_",
      )
      .then(() => {
        setMessage("Email sent successfully!");
        formRef.current?.reset();
      })
      .catch(() => {
        setMessage("Failed to send email");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container className={`!gap-0 ${className}`}>
      <form className="flex flex-col" ref={formRef} onSubmit={handleSubmit}>
        <label className="text-base font-bold" htmlFor="name">
          Name
        </label>
        <input
          className="mt-1 mb-3 pl-2 py-2 rounded-xs text-base"
          name="name"
          id="name"
          type="text"
          placeholder="Name"
          required
        />
        <label className="text-base font-bold" htmlFor="email">
          Email
        </label>
        <input
          className="mt-1 mb-3 pl-2 py-2 rounded-xs text-base"
          name="email"
          id="email"
          type="email"
          placeholder="Email"
          required
        />
        <label className="text-base font-bold" htmlFor="message">
          Message
        </label>
        <textarea
          className="mt-1 mb-3 pl-2 py-2 h-15 rounded-xs text-base"
          name="message"
          id="message"
          placeholder="Message"
          required
        />
        <div className="flex justify-center items-center mt-1">
          <button
            className="px-2 py-1 max-w-full md:max-w-50 border-2 border-accent rounded-xs bg-accent btn-highlight"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
        {message && (
          <p
            className={`mt-3 text-sm text-center py-2 rounded ${
              message.includes("successfully")
                ? "bg-green-900 text-green-200"
                : "bg-red-900 text-red-200"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </Container>
  );
};

export default ContactForm;
