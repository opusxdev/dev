"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Profile from "@/components/Profile";
import GitHubCalendar from "@/components/GitHubCalendar";
import { ExternalLink, Twitter, Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  const [visits, setVisits] = useState(0);
  const [contributions, setContributions] = useState<any>(null);

  useEffect(() => {
    // Simulate visit counter (in production, use a real analytics service)
    const storedVisits = localStorage.getItem("visits");
    const newVisits = storedVisits ? parseInt(storedVisits) + 1 : 1;
    localStorage.setItem("visits", newVisits.toString());
    setVisits(newVisits);
  }, []);

  const techQuotes = [
    "Code is like humor. When you have to explain it, it's bad.",
    "First, solve the problem. Then, write the code.",
    "The best code is no code at all.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Programs must be written for people to read, and only incidentally for machines to execute.",
  ];

  const [randomQuote, setRandomQuote] = useState<string>("");

  useEffect(() => {
    // Set quote only on client side to avoid hydration mismatch
    setRandomQuote(techQuotes[Math.floor(Math.random() * techQuotes.length)]);
  }, []);

  return (
    <main className="min-h-screen w-full max-w-[560px] mx-auto px-4 py-12 flex flex-col justify-between bg-[#0c0b0b] font-mono text-sm text-neutral-200">
      <div className="flex-1">
        {/* Profile Section */}
        <Profile />

        {/* Title Section */}
        <header className="mb-6">
          <h1 className="font-extrabold text-xl flex justify-between">
            <div>
              <div className="inline-block h-4 w-[4px] mr-2 bg-gradient-to-b from-sapphire-300 to-sapphire-400"></div>
              opusxdev
            </div>
            <div>
              <span className="text-[10px] text-neutral-500">{visits} visits</span>
            </div>
          </h1>
          <p className="mt-4 text-neutral-400">
            Hey, cooldev here, a full-stack engineer. I build robust and scalable web applications end to end.
          </p>
        </header>

        <section className="mt-6 flex flex-col gap-6 text-neutral-400">
          <div className="h-px w-full bg-neutral-900"></div>

          {/* MY STACK Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-neutral-200 text-xs font-semibold tracking-[0.12em] uppercase">
              MY STACK
            </h2>
            <p className="gap-1 text-s">
              <span className="group-hover:text-sapphire-400">[</span> Express.js, Postgresql, MongoDB, React, Git, Tailwindcss, TypeScript{" "}
              <span className="group-hover:text-sapphire-400">]</span>
            </p>
          </div>

          <div className="h-px w-full bg-neutral-900"></div>

          {/* EXPERIENCE Section */}
          <div className="flex flex-col gap-5">
            <h2 className="text-neutral-200 text-xs font-semibold tracking-[0.12em] uppercase">
              EXPERIENCE
            </h2>
            <article className="relative pl-3 group">
              <div className="absolute left-0 top-1 h-3 w-[3px] bg-gradient-to-b from-sapphire-300 to-sapphire-400"></div>
              <h3 className="font-semibold flex justify-between text-neutral-200 items-center">
                <span className="group-hover:underline group-hover:text-sapphire-400 underline-offset-2 transition-colors">
                  Full-Stack Development Cohort
                </span>
                <div className="flex items-center mb-1">
                  <div className="h-1 w-1 mx-2 bg-emerald-600 rounded-full animate-pulse"></div>
                  <p className="text-xs text-neutral-600 tracking-tight">Graduated</p>
                </div>
              </h3>
              <p className="mt-1 text-neutral-400 text-s leading-relaxed">
                Graduated from a full-stack development cohort, where I learned end-to-end application architecture, built scalable web apps with modern frameworks, and contributed to various hackathons and developer events.
              </p>
            </article>
          </div>

          <div className="h-px w-full bg-neutral-900"></div>

          {/* PROJECTS Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-neutral-200 text-xs font-semibold tracking-[0.12em] uppercase">
                PROJECTS
              </h2>
              <Link
                href="/projects"
                className="text-xs flex underline-offset-3 items-center gap-1 text-neutral-500 hover:text-sapphire-400 transition-all hover:underline"
              >
                <span>view all</span>
                <ExternalLink className="w-[10px] h-[10px]" />
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <article className="relative pl-3 group">
                <div className="absolute left-0 top-1 h-3 w-[3px] bg-gradient-to-b from-sapphire-300 to-sapphire-400"></div>
                <h3 className="font-semibold text-neutral-200">
                  <span className="group-hover:underline group-hover:text-sapphire-400 underline-offset-2 transition-colors">
                    Accentra
                  </span>
                </h3>
                <p className="mt-1 text-neutral-400 text-s leading-relaxed">
                  Reimagining permission orchestration: a platform centralizing access control, feature entitlements, and optional Web3 ownership.
                </p>
                <span className="text-xs text-sapphire-400 mt-2 inline-block font-normal uppercase tracking-wide">
                  CURRENTLY BUILDING
                </span>
              </article>

              <article className="relative pl-3 group">
                <div className="absolute left-0 top-1 h-3 w-[3px] bg-gradient-to-b from-sapphire-300 to-sapphire-400"></div>
                <h3 className="font-semibold text-neutral-200">
                  <span className="group-hover:underline group-hover:text-sapphire-400 underline-offset-2 transition-colors">
                    SynapseApp
                  </span>
                </h3>
                <p className="mt-1 text-neutral-400 text-s leading-relaxed">
                  Scalable real-time chat app built on the MERN stack with live messaging and full-stack authentication.
                </p>
              </article>

              <article className="relative pl-3 group">
                <div className="absolute left-0 top-1 h-3 w-[3px] bg-gradient-to-b from-sapphire-300 to-sapphire-400"></div>
                <h3 className="font-semibold text-neutral-200">
                  <span className="group-hover:underline group-hover:text-sapphire-400 underline-offset-2 transition-colors">
                    MacBook Pro
                  </span>
                </h3>
                <p className="mt-1 text-neutral-400 text-s leading-relaxed">
                  High-fidelity MacBook Pro website clone with interactive 3D elements, built using Three.js, GSAP, Zustand, and Tailwind CSS.
                </p>
              </article>
            </div>
          </div>

          <div className="h-px w-full bg-neutral-900"></div>

          {/* BLOGS Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-neutral-200 text-s font-semibold tracking-[0.12em] uppercase">
              BLOGS
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                href="/blog/perspectives"
                className="relative pl-3 group flex flex-col"
              >
                <div className="absolute left-0 top-1 h-3 w-[3px] bg-gradient-to-b from-sapphire-300 to-sapphire-400"></div>
                <h3 className="font-semibold text-neutral-200">
                  <span className="group-hover:underline group-hover:text-sapphire-400 underline-offset-2 transition-colors">
                    PERSPECTIVES
                  </span>
                </h3>
                <p className="mt-1 text-neutral-400 text-s leading-relaxed">
                  Exploring the intersection of technology and human experience through thoughtful reflection and analysis.
                </p>
              </Link>

              <Link
                href="/blog/mortality-is-insanity"
                className="relative pl-3 group flex flex-col"
              >
                <div className="absolute left-0 top-1 h-3 w-[3px] bg-gradient-to-b from-sapphire-300 to-sapphire-400"></div>
                <h3 className="font-semibold text-neutral-200">
                  <span className="group-hover:underline group-hover:text-sapphire-400 underline-offset-2 transition-colors">
                    MORTALITY IS INSANITY
                  </span>
                </h3>
                <p className="mt-1 text-neutral-400 text-s leading-relaxed">
                  A philosophical exploration of existence, consciousness, and the paradox of mortality in the digital age.
                </p>
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-900">
            <div className="w-full overflow-x-auto">
              <GitHubCalendar username="opusxdev" />
            </div>
          </div>
        </section>
      </div>

      <footer className="flex justify-between -mb-6 items-center pt-4 mt-6 border-t border-neutral-900">
        <div className="flex items-center gap-1 text-neutral-500">
          <span>©</span>
          <span className="text-xs">2026 cooldev</span>
        </div>
        <div className="flex gap-3 text-neutral-500">
          <a
            className="hover:text-sapphire-300 transition-colors"
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            className="hover:text-sapphire-300 transition-colors"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            className="hover:text-sapphire-300 transition-colors"
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            className="hover:text-sapphire-300 transition-colors"
            href="mailto:your@email.com"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </main>
  );
}
