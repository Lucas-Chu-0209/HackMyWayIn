export const siteConfig = {
  brand: "Hack My Way In",
  name: "Lucas Chu",
  roles: ["Innovative Programmer", "Developer", "and Ethical Hacker"],
  tagline: "I build playful experiences and secure systems—one challenge at a time.",
  ctaPrimary: "Contact me",
  ctaSecondary: "View projects",
};

export const bio = `I'm a creative and innovative programmer with a growing focus on cybersecurity. I've built web projects end-to-end and explored areas like backend security systems, log analysis, and web scraping. As a security beginner, I'm actively learning through hands-on projects and challenges. I'm also an outgoing, collaborative teammate—proactive, easy to work with, and always curious to learn more.`;

export const skills = {
  languages: ["Python", "C/C++", "HTML", "CSS", "Java", "JavaScript", "R"],
  tools: ["GitHub", "React", "Tailwind CSS", "Wireshark", "VMWare", "UTM", "Kali Linux"],
};

export const education = [
  {
    period: "2021 – Present",
    institution: "National Taiwan University",
    program: "Department of Library and Information Science",
  },
];

export const experience = [
  {
    year: "2025",
    title: "Summer Intern",
    organization: "FlySheet Information Services Co., Ltd.",
    bullets: [
      "Automated Excel ingestion & system integration",
      "Log Analyzer for a backend security system",
      "ISBN-based book scraper (Books.com.tw)",
    ],
  },
  {
    year: "2025",
    title: "Finalist",
    organization: "Qualcomm Edge AI Developer Hackathon",
    bullets: ["AnoniMe: a real-time on-device de-identification application"],
  },
  {
    year: "2023",
    title: "Finalist",
    organization: "Coding 101",
    bullets: ["Decision Helper: a LINE Bot cafe recommendation system"],
  },
];

export const projects = [
  {
    title: "AnoniMe",
    description:
      "A real-time on-device de-identification application built for the Qualcomm Edge AI Developer Hackathon. Runs entirely on-device to protect user privacy without cloud dependency.",
    tags: ["Python", "QML", "KUWA GenAI OS", "Llama 3.1 8B @NPU", "Qualcomm"],
    github: "https://github.com/penpenpenguin/AnoniMe",
    demo: "",
    writeup: "",
    theme: "A",
    image: { src: "/projects/anoni-me-rmbg.png", alt: "AnoniMe project preview" },
  },
  {
    title: "Decision Helper",
    description:
      "A LINE Bot cafe recommendation system that helps users decide where to eat using conversational AI and location-based filtering.",
    tags: ["Python", "LINE Bot", "Heroku", "Google Geocoding API", "Web Scraping"],
    github: "https://github.com/tacochan0129/helpyouchoose",
    demo: "https://youtu.be/WOkEea_jgek",
    writeup: "",
    theme: "B",
    image: { src: "/projects/decision_rmbg.png", alt: "Decision Helper project preview" },
  },
  {
    title: "HackMyWayIn",
    description:
      "A personal brand and resume website featuring smooth scroll navigation, responsive design, and a clean light theme with a subtle hacker aesthetic.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    github: "https://github.com/Lucas-Chu-0209/HackMyWayIn",
    demo: "",
    writeup: "",
    theme: "A",
    image: { src: "/projects/HMWI_rmbg.png", alt: "HackMyWayIn project preview" },
  },
];

export const contactLinks = [
  { label: "Email", href: "mailto:lucasauriant0209@gmail.com", icon: "email" },
  { label: "GitHub", href: "https://github.com/Lucas-Chu-0209", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lucas-chu-931a45363/", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/lucas._.hmwi?igsh=MXYyNWR6a2Y1azUxbQ%3D%3D&utm_source=qr", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/share/17kHgM3pJZ/?mibextid=wwXIfr", icon: "facebook" },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
