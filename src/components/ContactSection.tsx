import { contactLinks } from "@/content";
import SectionHeader from "./SectionHeader";
import SocialLinkButton from "./SocialLinkButton";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Contact Me!"
          subtitle="Feel free to reach out for collaborations, questions, or even just want to say hi!"
        />
        <div className="max-w-xl">
          <p className="text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
            Have a project in mind, want to collaborate, or just want to say hello?
            Feel free to reach out through any of these channels.
          </p>
          <p className="text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
            Residence: Taipei, Taiwan<br></br>
            Email: lucasauriant0209@gmail.com<br></br>
            Phone: +886 966837966<br></br>
            Line ID: 86318732 (no spam allowed)
          </p>
          <div className="flex flex-wrap gap-3">
            {contactLinks.map((link) => (
              <SocialLinkButton
                key={link.label}
                label={link.label}
                href={link.href}
                icon={link.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
