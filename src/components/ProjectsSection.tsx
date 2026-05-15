import { projects } from "@/content";
import SectionHeader from "./SectionHeader";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="rounded-3xl border border-zinc-200 bg-white px-6 py-14 shadow-sm transition-[border-color,box-shadow] duration-200 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-2xl dark:hover:shadow-black/20 sm:px-8 lg:px-10"
    >
      <div>
        <SectionHeader
          title="Projects"
          subtitle="Selected work across security, web, and creative coding."
        />
        <div className="space-y-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              tags={project.tags}
              github={project.github}
              demo={project.demo}
              writeup={project.writeup}
              theme={project.theme as "A" | "B"}
              image={project.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
