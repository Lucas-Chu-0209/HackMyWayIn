import { contactLinks } from "@/content";
import SectionHeader from "./SectionHeader";
import SocialLinkButton from "./SocialLinkButton";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Contact"
          subtitle="Let's build something fun—and secure."
        />
        <div className="max-w-xl">
          <p className="text-gray-600 mb-8 leading-relaxed">
            Have a project in mind, want to collaborate, or just want to say hello?
            Feel free to reach out through any of these channels.
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
