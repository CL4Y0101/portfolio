"use client";

import {
  BriefcaseBusiness,
  Code2,
  ContactRound,
  Copy,
  Download,
  ExternalLink,
  FolderKanban,
  GitFork,
  GraduationCap,
  Home,
  Mail,
  MoonStar,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ComponentType } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { copyText } from "@/lib/clipboard";
import { toggleTheme } from "@/lib/theme";

type Command = {
  id: string;
  label: string;
  group: "Navigate" | "Projects" | "Actions";
  keywords: string;
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  run: () => void | Promise<"stay" | void>;
};

type CommandPaletteProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export function CommandPalette({ open, onOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [status, setStatus] = useState("");
  const statusTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleShortcut(event: globalThis.KeyboardEvent) {
      const target = event.target;
      const isTyping = target instanceof HTMLElement &&
        (target.matches("input, textarea, select") || target.isContentEditable);

      if (isTyping) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpen();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [onOpen]);

  useEffect(() => () => {
    if (statusTimeout.current) clearTimeout(statusTimeout.current);
  }, []);

  function navigate(href: string) {
    router.push(href);
  }

  const commands = useMemo<Command[]>(() => [
    { id: "home", label: "Go to Home", group: "Navigate", keywords: "start intro", icon: Home, run: () => navigate("/#home") },
    { id: "work", label: "View Projects", group: "Navigate", keywords: "work portfolio", icon: FolderKanban, run: () => navigate("/#work") },
    { id: "experience", label: "View Experience", group: "Navigate", keywords: "career timeline", icon: BriefcaseBusiness, run: () => navigate("/#experience") },
    { id: "skills", label: "View Skills", group: "Navigate", keywords: "capabilities technology", icon: Code2, run: () => navigate("/#skills") },
    { id: "education", label: "View Education", group: "Navigate", keywords: "study school", icon: GraduationCap, run: () => navigate("/#education") },
    { id: "about", label: "View About", group: "Navigate", keywords: "profile bio", icon: UserRound, run: () => navigate("/#about") },
    { id: "contact", label: "View Contact", group: "Navigate", keywords: "email collaborate", icon: Mail, run: () => navigate("/#contact") },
    ...projects.map<Command>((project) => ({
      id: `project-${project.slug}`,
      label: `Open ${project.title}`,
      group: "Projects",
      keywords: `${project.subtitle} ${project.technologies.join(" ")}`,
      icon: FolderKanban,
      run: () => navigate(`/projects/${project.slug}`),
    })),
    { id: "github", label: "Open GitHub", group: "Actions", keywords: "code repository", icon: GitFork, run: () => window.open(profile.github, "_blank", "noopener,noreferrer") },
    { id: "linkedin", label: "Open LinkedIn", group: "Actions", keywords: "social professional", icon: ContactRound, run: () => window.open(profile.linkedin, "_blank", "noopener,noreferrer") },
    {
      id: "download-cv",
      label: "Download CV",
      group: "Actions",
      keywords: "resume curriculum vitae",
      icon: Download,
      run: () => {
        const link = document.createElement("a");
        link.href = profile.cv;
        link.download = "aditya-fadni-athaullah-cv.pdf";
        link.click();
      },
    },
    { id: "theme", label: "Toggle Theme", group: "Actions", keywords: "light dark color", icon: MoonStar, run: () => { toggleTheme(); } },
    {
      id: "copy-email",
      label: "Copy Email",
      group: "Actions",
      keywords: "contact clipboard",
      icon: Copy,
      run: async () => {
        try {
          await copyText(profile.email);
          setStatus("Email copied");
        } catch {
          setStatus("Unable to copy email");
        }
        if (statusTimeout.current) clearTimeout(statusTimeout.current);
        statusTimeout.current = setTimeout(() => setStatus(""), 1800);
        return "stay";
      },
    },
  ], [router]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCommands = commands.filter((command) =>
    `${command.label} ${command.keywords}`.toLowerCase().includes(normalizedQuery),
  );

  async function execute(command: Command | undefined) {
    if (!command) return;
    const result = await command.run();
    if (result !== "stay") closePalette();
  }

  function closePalette() {
    setQuery("");
    setSelectedIndex(0);
    setStatus("");
    onClose();
  }

  function handleInputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => filteredCommands.length ? (index + 1) % filteredCommands.length : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => filteredCommands.length ? (index - 1 + filteredCommands.length) % filteredCommands.length : 0);
    } else if (event.key === "Enter") {
      event.preventDefault();
      void execute(filteredCommands[selectedIndex]);
    }
  }

  return (
    <Dialog open={open} onClose={closePalette} labelledBy="command-palette-title" className="command-dialog">
      <div className="dialog-panel command-panel">
        <div className="command-heading">
          <div>
            <p className="eyebrow">Quick navigation</p>
            <h2 id="command-palette-title">Command palette</h2>
          </div>
          <button type="button" className="icon-button" onClick={closePalette} aria-label="Close command palette">
            <X aria-hidden="true" size={19} />
          </button>
        </div>

        <div className="command-search">
          <Search aria-hidden="true" size={18} />
          <input
            data-autofocus
            type="search"
            value={query}
            placeholder="Type a command or project…"
            aria-label="Filter commands"
            aria-controls="command-results"
            aria-activedescendant={filteredCommands[selectedIndex] ? `command-${filteredCommands[selectedIndex].id}` : undefined}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKey}
          />
          <kbd>Esc</kbd>
        </div>

        <div id="command-results" className="command-results" role="listbox" aria-label="Available commands">
          {filteredCommands.length ? filteredCommands.map((command, index) => {
            const Icon = command.icon;
            return (
              <button
                key={command.id}
                id={`command-${command.id}`}
                type="button"
                role="option"
                aria-selected={index === selectedIndex}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => void execute(command)}
              >
                <Icon aria-hidden={true} size={18} />
                <span>{command.label}</span>
                <small>{command.group}</small>
                <ExternalLink aria-hidden="true" size={14} />
              </button>
            );
          }) : <p className="command-empty">No matching commands.</p>}
        </div>
        <div className="command-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Open</span>
          <span role="status" aria-live="polite">{status}</span>
        </div>
      </div>
    </Dialog>
  );
}
