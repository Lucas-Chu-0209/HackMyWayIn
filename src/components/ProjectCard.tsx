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
  const bg = theme === "A" ? "bg-[#F0F4F7]" : "bg-[#F5F5F0]";

  return (
    <div
      className={`group flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${bg}`}
    >
      {/* Project image or placeholder */}
      <div className="md:w-2/5 relative overflow-hidden bg-gradient-to-br from-blue-200/60 to-blue-100/60 min-h-[200px] md:min-h-[240px] flex items-center justify-center">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        ) : (
          <div className="transition-transform duration-500 group-hover:scale-105 flex flex-col items-center gap-2 text-blue-700/60">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-mono">image placeholder</span>
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="md:w-3/5 p-6 flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-white text-blue-700 border border-blue-200 rounded-full">
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              GitHub
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Demo
            </a>
          )}
          {writeup && (
            <a
              href={writeup}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-700 hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Write-up
            </a>
          )}
          {!github && !demo && !writeup && (
            <span className="px-4 py-2 text-sm text-gray-400 italic">Links coming soon</span>
          )}
        </div>
      </div>
    </div>
  );
}
