import { withBasePath } from "@/lib/constants";

export const profile = {
  name: "Aditya Fadni Athaullah",
  shortName: "Aditya Fadni",
  eyebrow: "Software Developer · Informatics Engineering Student",
  headline: "Web products that work in the real world.",
  introduction:
    "I build web products, connect the data behind them, and help keep them online.",
  supportingText:
    "Currently contributing to production web development, Firebase-backed systems, Linux deployment, and a multi-campus platform while studying at Politeknik Negeri Jember.",
  location: "Jember, Indonesia",
  email: "aditya.fadni@gmail.com",
  github: "https://github.com/CL4Y0101",
  linkedin: "https://www.linkedin.com/in/aditya-fadni-312373308/",
  profileImage: withBasePath("/images/profile-voxel.webp"),
  cv: {
    en: withBasePath("/cv/Aditya_Fadni_Athaullah_CV_EN.pdf"),
    id: withBasePath("/cv/Aditya_Fadni_Athaullah_CV_ID.pdf"),
  },
  about: [
    "I build product interfaces and the systems that keep them running, from application data to deployment.",
    "My networking background helps me trace issues across browsers, servers, and infrastructure.",
  ],
};
