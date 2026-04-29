import { projects } from "@/content";
import SectionHeader from "./SectionHeader";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 bg-[#F7F7F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Projects"
          subtitle="Selected work across security, web, and creative coding."
        />
        <div className="space-y-8">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              tags={project.tags}
              github={project.github}
              demo={project.demo}
              writeup={project.writeup}
              theme={project.theme as "A" | "B"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
