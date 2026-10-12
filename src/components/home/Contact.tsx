import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import Reveal from "@/components/layout/Reveal";
import Section from "@/components/layout/Section";
import { profile } from "@/content/profile";

export default function Contact() {
  return (
    <Section id="contact" index="03" title="Get in Touch">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-20">
        <Reveal>
          <div className="flex flex-col gap-8">
            <p className="max-w-[54ch] leading-relaxed text-ink-muted">
              {profile.contact.intro}
            </p>
            <ContactForm />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <ContactInfo />
        </Reveal>
      </div>
    </Section>
  );
}
