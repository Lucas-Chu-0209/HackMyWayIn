import Image from "next/image";

interface ProjectImage {
  src: string;
  alt: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo: string;
  writeup: string;
  theme: "A" | "B";
  image?: ProjectImage;
}

export default function ProjectCard({ title, description, tags, github, demo, writeup, theme, image }: ProjectCardProps) {
  const bg = theme === "A"
    ? "bg-white dark:bg-zinc-800"
    : "bg-zinc-50 dark:bg-zinc-800";
  const mediaBg = theme === "A"
    ? "bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700/60 dark:to-zinc-800/60"
    : "bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800/60 dark:to-zinc-700/60";

  return (
    <div
      className={`group flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-zinc-900/50 ${bg}`}
    >
      {/* Project image or placeholder */}
      <div className={`md:w-2/5 ${mediaBg} flex items-center justify-center p-5 md:p-7`}>
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700/50 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700/50">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : (
            <div className="transition-transform duration-500 group-hover:scale-105 flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-mono">image placeholder</span>
            </div>
          )}
        </div>
      </div>

      {/* Text content */}
      <div className="md:w-3/5 p-6 flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-zinc-700 text-white hover:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              GitHub
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            >
              Demo Sample
            </a>
          )}
          {writeup && (
            <a
              href={writeup}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-400 dark:border-zinc-500 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            >
              Write-up
            </a>
          )}
          {!github && !demo && !writeup && (
            <span className="px-4 py-2 text-sm text-zinc-400 italic">Links coming soon</span>
          )}
        </div>
      </div>
    </div>
  );
}
