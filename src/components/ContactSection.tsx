import { contactLinks } from "@/content";
import SectionHeader from "./SectionHeader";
import SocialLinkButton from "./SocialLinkButton";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-14 shadow-sm transition-[background-color,border-color,box-shadow] duration-200 hover:bg-zinc-100 hover:border-zinc-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/50 dark:hover:border-white/15 dark:hover:shadow-2xl dark:hover:shadow-black/20 sm:px-8 lg:px-10"
    >
      <div>
        <SectionHeader
          title="Contact Me!"
          subtitle="Feel free to reach out for collaborations, questions, or even just want to say hi!"
        />
        <div className="max-w-xl">
          <p className="text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
            I'm socially active! Feel free to reach out through any of these channels~ or if you only want to say hi, that's perfectly fine too!
            Also I'm an animal lover, so it would be great and much easier for you to get my attention if you send some furry lil friends when reaching out!
          </p>
          <p className="text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
            Residence: Taipei, Taiwan<br></br>
            Email: lucasauriant0209@gmail.com<br></br>
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
