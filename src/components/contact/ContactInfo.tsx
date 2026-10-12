import CopyEmailButton from "@/components/contact/CopyEmailButton";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { profile } from "@/content/profile";

const ICONS = {
  email: MailIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
} as const;

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-2xl">{profile.contact.heading}</h3>
        <p className="text-sm text-ink-muted">{profile.contact.subheading}</p>
      </div>

      <ul className="flex flex-col divide-y divide-rule border-y border-rule">
        {profile.contact.channels.map((channel) => {
          const Icon = ICONS[channel.kind];
          return (
            <li key={channel.kind} className="flex items-center gap-4 py-4">
              <Icon className="h-4 w-4 shrink-0 text-ink-faint" />
              <span className="w-24 shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                {channel.label}
              </span>
              {channel.kind === "email" ? (
                <CopyEmailButton email={profile.contact.email} />
              ) : (
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-muted transition-colors hover:text-accent"
                >
                  {channel.display}
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <ul className="flex flex-col gap-3">
        {profile.contact.facts.map((fact) => (
          <li key={fact.label} className="flex gap-3 font-mono text-xs">
            <span className="text-ink-faint">{fact.label}</span>
            <span className="text-ink-muted">{fact.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
