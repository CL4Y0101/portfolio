import { withBasePath } from "@/lib/constants";

export const profile = {
  name: "Aditya Fadni Athaullah",
  shortName: "Aditya Fadni",
  eyebrow: "Software Developer · Informatics Engineering Student",
  headline: "I build practical software for the web—and keep it running.",
  introduction:
    "I work across modern web interfaces, backend systems, deployment pipelines, and cloud infrastructure, grounded by an earlier foundation in computer networking.",
  supportingText:
    "Currently contributing to production web development, Firebase-backed systems, Linux deployment, and a multi-campus platform while studying at Politeknik Negeri Jember.",
  location: "Jember, Indonesia",
  email: "aditya.fadni@gmail.com",
  github: "https://github.com/CL4Y0101",
  linkedin: "https://www.linkedin.com/in/aditya-fadni-312373308/",
  profileImage: withBasePath("/images/profile.jpg"),
  cv: withBasePath("/cv/aditya-fadni-athaullah-cv.pdf"),
  about: [
    "My current work sits at the intersection of product development and operations: building Next.js interfaces, connecting application data, and maintaining the environments that deliver those systems.",
    "Before focusing on software, I studied Computer and Network Engineering. That background still shapes how I debug—following a problem across the browser, application, process, server, and network instead of treating each layer in isolation.",
  ],
};
