import { profile } from "@/content/profile";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";

const ICONS = {
  email: MailIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
} as const;

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul className="flex items-center gap-5">
          {profile.contact.channels.map((channel) => {
            const Icon = ICONS[channel.kind];
            const isExternal = channel.href.startsWith("http");
            return (
              <li key={channel.kind}>
                <a
                  href={channel.href}
                  aria-label={channel.label}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="block text-ink-muted transition-colors hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
