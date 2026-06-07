const projectData = [
  {
    title: "GreenPoint PostgreSQL",
    subtitle: "Waste Bank Management System",
    category: ["web", "mobile", "database"],
    image: "src/img/projects/greenpoint-postgresql.png",
    alt: "GreenPoint PostgreSQL website landing page screenshot",
    description:
      "Production deployment of GreenPoint using PostgreSQL, featuring a public landing page for the digital waste bank platform and system access flow.",
    stack: ["Laravel", "Flutter", "PostgreSQL", "REST API"],
    github: "https://github.com/CL4Y0101",
    demo: "https://green-point.app"
  },
  {
    title: "GreenDaPoint MySQL",
    subtitle: "MySQL Deployment",
    category: ["web", "database"],
    image: "src/img/projects/greenpoint-mysql.png",
    alt: "GreenDaPoint MySQL website landing page screenshot",
    description:
      "MySQL-based GreenPoint deployment for the waste bank platform, maintained as a separate environment from the PostgreSQL version.",
    stack: ["Laravel", "MySQL", "Bootstrap", "REST API"],
    github: "https://github.com/CL4Y0101",
    demo: "https://greendapoint.me"
  },
  {
    title: "Project Slot",
    subtitle: "Future Web Application",
    category: ["web"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    alt: "Developer workspace with code editor",
    description:
      "Reserved card for a future portfolio project. Add a new object to projectData in script.js to update this gallery.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    github: "https://github.com/CL4Y0101",
    demo: "#"
  },
  {
    title: "Network Lab",
    subtitle: "Infrastructure Documentation",
    category: ["networking"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    alt: "Network server hardware with connected cables",
    description:
      "A documentation-ready project format for router configuration, access point deployment, troubleshooting notes, and maintenance reports.",
    stack: ["MikroTik", "Cisco", "Wireshark"],
    github: "https://github.com/CL4Y0101",
    demo: "#"
  }
];

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const siteHeader = document.querySelector(".site-header");
const heroSection = document.querySelector(".hero");
const projectGrid = document.querySelector("#projectGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const contributionGrid = document.querySelector("#contributionGrid");
const year = document.querySelector("#year");
const profilePhoto = document.querySelector(".profile-photo");
const githubStatus = document.querySelector("#githubStatus");
const githubRepos = document.querySelector("#githubRepos");
const githubFollowers = document.querySelector("#githubFollowers");
const githubStars = document.querySelector("#githubStars");
const githubLatest = document.querySelector("#githubLatest");
const githubUsername = "CL4Y0101";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[character]
  );

const renderProjects = (filter = "all") => {
  const projects =
    filter === "all"
      ? projectData
      : projectData.filter((project) => project.category.includes(filter));

  projectGrid.innerHTML = projects
    .map(
      (project, index) => `
        <article class="project-card reveal visible" style="--reveal-delay: ${index * 70}ms">
          <div class="project-image">
            <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.alt)}" loading="lazy" />
          </div>
          <div class="project-body">
            <span class="project-category">${escapeHtml(project.subtitle)}</span>
            <div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.description)}</p>
            </div>
            <div class="tags">
              ${project.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
            </div>
            <div class="project-actions">
              <a class="btn btn-ghost" href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer">GitHub</a>
              <a class="btn btn-primary" href="${escapeHtml(project.demo)}" target="${project.demo === "#" ? "_self" : "_blank"}" rel="noreferrer">Live Demo</a>
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

const updateHeaderState = () => {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (heroSection && !prefersReducedMotion) {
  heroSection.addEventListener("pointermove", (event) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroSection.style.setProperty("--hero-shift-x", `${x * 18}px`);
    heroSection.style.setProperty("--hero-shift-y", `${y * 18}px`);
  });

  heroSection.addEventListener("pointerleave", () => {
    heroSection.style.setProperty("--hero-shift-x", "0px");
    heroSection.style.setProperty("--hero-shift-y", "0px");
  });
}

const closeMobileMenu = () => {
  navMenu.classList.remove("open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMobileMenu();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

if (profilePhoto) {
  const showProfilePhoto = () => {
    if (profilePhoto.naturalWidth > 0) {
      profilePhoto.classList.add("is-loaded");
    }
  };

  if (profilePhoto.complete) {
    showProfilePhoto();
  }

  profilePhoto.addEventListener("load", showProfilePhoto);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 360)}ms`);
  revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = Number(entry.target.dataset.counter);
      let current = 0;
      const duration = 900;
      const startTime = performance.now();

      const updateCounter = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        current = Math.floor(progress * target);
        entry.target.textContent = `${current}+`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          entry.target.textContent = `${target}+`;
        }
      };

      requestAnimationFrame(updateCounter);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-counter]").forEach((counter) => {
  counterObserver.observe(counter);
});

const formatDate = (value) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));

const getDateKey = (date) => date.toISOString().slice(0, 10);

const getActivityLevel = (count) => {
  if (count >= 4) return 3;
  if (count >= 2) return 2;
  if (count >= 1) return 1;
  return 0;
};

const renderContributionGrid = (activityCounts = new Map()) => {
  const cells = Array.from({ length: 104 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (103 - index));
    const key = getDateKey(date);
    const count = activityCounts.get(key) || 0;
    const level = getActivityLevel(count);

    return `<span class="contribution-cell level-${level}" title="${formatDate(date)}: ${count} public GitHub event${count === 1 ? "" : "s"}"></span>`;
  });

  contributionGrid.innerHTML = cells.join("");
};

const loadGithubActivity = async () => {
  try {
    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUsername}`),
      fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`),
      fetch(`https://api.github.com/users/${githubUsername}/events/public?per_page=100`)
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error("GitHub API request failed");
    }

    const user = await userResponse.json();
    const repos = await reposResponse.json();
    const events = eventsResponse.ok ? await eventsResponse.json() : [];
    const totalStars = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
    const latestRepo = repos.find((repo) => repo.pushed_at || repo.updated_at);
    const activityCounts = new Map();

    events.forEach((event) => {
      const key = getDateKey(new Date(event.created_at));
      activityCounts.set(key, (activityCounts.get(key) || 0) + 1);
    });

    githubRepos.textContent = user.public_repos;
    githubFollowers.textContent = user.followers;
    githubStars.textContent = totalStars;
    githubLatest.textContent = latestRepo ? formatDate(latestRepo.pushed_at || latestRepo.updated_at) : "--";
    githubStatus.textContent = `Connected to github.com/${githubUsername}. Showing public profile, repository stats, and recent public events.`;
    renderContributionGrid(activityCounts);
  } catch (error) {
    githubStatus.textContent =
      "GitHub data could not be loaded right now. The profile link is still connected to github.com/CL4Y0101.";
    renderContributionGrid();
  }
};

renderProjects();
renderContributionGrid();
loadGithubActivity();
year.textContent = new Date().getFullYear();
