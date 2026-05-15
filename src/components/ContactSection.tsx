import { contactLinks } from "@/content";
import SectionHeader from "./SectionHeader";
import SocialLinkButton from "./SocialLinkButton";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="rounded-3xl border border-zinc-200 bg-white px-6 py-14 shadow-sm transition-[background-color,border-color,box-shadow] duration-200 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-2xl dark:hover:shadow-black/20 sm:px-8 lg:px-10"
    >
      <div>
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
