import { MdEmail } from "react-icons/md";
import Container from "../Layout/Container";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface ContactInfoProps {
  className?: string;
}

const ContactInfo = ({ className }: ContactInfoProps) => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    const email = "aronmatoic@gmail.com";
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for HTTP
        const textArea = document.createElement("textarea");
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Container className={`!h-auto ${className}`}>
      <h3>Let's work together</h3>
      <span className="text-text-secondary">
        Open to opportunities and collaborations
      </span>

      <ul className="flex flex-col gap-2">
        <li className="flex gap-1 items-center p-2 bg-background-input rounded-xs">
          <MdEmail className="mr-1.5 w-5 h-5 bg-transparent" />
          <span className="text-base font-bold bg-transparent">Email:</span>
          <button
            type="button"
            className="text-sm text-text-secondary bg-transparent hover:underline cursor-pointer"
            onClick={copyEmail}
          >
            {copied ? "Copied!" : "aronmatoic@gmail.com"}
          </button>
        </li>

        <li className="flex gap-1 items-center p-2 bg-background-input rounded-xs">
          <FaLinkedin className="mr-1.5 w-5 h-5 bg-transparent" />
          <span className="text-base font-bold bg-transparent">LinkedIn:</span>
          <Link
            to="https://www.linkedin.com/in/aron-matoic-4818282b6/"
            className="text-sm text-text-secondary bg-transparent hover:underline cursor-pointer"
          >
            /aron-matoic-4818282b6
          </Link>
        </li>

        <li className="flex gap-1 items-center p-2 bg-background-input rounded-xs">
          <FaGithub className="mr-1.5 w-5 h-5 bg-transparent" />
          <span className="text-base font-bold bg-transparent">GitHub:</span>
          <Link
            to="https://github.com/ParalelSt"
            className="text-sm text-text-secondary bg-transparent hover:underline cursor-pointer"
          >
            /ParalelSt
          </Link>
        </li>
      </ul>

      <ul className="flex flex-col gap-3">
        <li className="flex gap-1 items-center text-base">
          Location:
          <span className="text-sm text-text-secondary">
            Croatia (Remote-friendly)
          </span>
        </li>
        <li className="flex gap-1 items-center text-base">
          Response time:
          <span className="text-sm text-text-secondary">
            Usually within 24 hours
          </span>
        </li>
      </ul>
    </Container>
  );
};

export default ContactInfo;
