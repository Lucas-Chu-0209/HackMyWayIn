import { bio, skills, education, experience } from "@/content";
import SectionHeader from "./SectionHeader";
import SkillChip from "./SkillChip";
import TimelineItem from "./TimelineItem";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="About"
          subtitle="Curious by nature. Learning security by doing."
        />

        <div className="space-y-16">
          {/* Bio */}
          <div className="grid md:grid-cols-[120px_1fr] gap-4 md:gap-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Bio</h3>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{bio}</p>
          </div>

          {/* Skills */}
          <div className="grid md:grid-cols-[120px_1fr] gap-4 md:gap-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Skills</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">Programming Languages</p>
                <div className="flex flex-wrap gap-2">
                  {skills.languages.map((s) => (
                    <SkillChip key={s} label={s} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">Tools &amp; Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((s) => (
                    <SkillChip key={s} label={s} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="grid md:grid-cols-[120px_1fr] gap-4 md:gap-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Education</h3>
            <div>
              {education.map((ed, i) => (
                <TimelineItem
                  key={i}
                  period={ed.period}
                  title={ed.institution}
                  organization={ed.program}
                />
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="grid md:grid-cols-[120px_1fr] gap-4 md:gap-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Experience</h3>
            <div>
              {experience.map((exp, i) => (
                <TimelineItem
                  key={i}
                  period={exp.year}
                  title={exp.title}
                  organization={exp.organization}
                  bullets={exp.bullets}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
