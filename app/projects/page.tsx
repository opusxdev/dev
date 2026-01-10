"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProjectsPage() {
  const allProjects = [
    {
      title: "Accentra",
      description:
        "Reimagining permission orchestration : a platform centralizing access control, feature entitlements, and optional Web3 ownership.",
      status: "CURRENTLY BUILDING",
    },
    {
      title: "SynapseApp",
      description:
        "Scalable real-time chat app built on the MERN stack with live messaging and full-stack authentication.",
    },
    {
      title: "MacBook Pro",
      description:
        "High-fidelity MacBook Pro website clone with interactive 3D elements, built using Three.js, GSAP, Zustand, and Tailwind CSS.",
    },
    {
      title: "CryptoVerse App",
      description:
        "Real-time crypto dashboard displaying top 100 cryptocurrencies with live stats, built using the CoinGecko API and modern web technologies.",
    },
    {
      title: "NASA APOD",
      description:
        "Interactive web app displaying NASA's Astronomy Picture of the Day with detailed descriptions, built using the NASA API.",
    },
    {
      title: "CodeFlow",
      description:
        "AI-powered code review platform where users upload code and receive suggestions for errors and optimizations, built using gemini API.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-mono">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#E5E5E5] hover:text-[#FF6B35] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>back</span>
        </Link>

        <h1 className="text-[#FF6B35] text-2xl font-semibold uppercase mb-8 tracking-wide">
          ALL PROJECTS
        </h1>

        <div className="space-y-6">
          {allProjects.map((project, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-1 h-6 bg-[#FF6B35] mt-1 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-[#E5E5E5] font-semibold">{project.title}</h3>
                  {project.status && (
                    <span className="text-xs text-[#FF6B35] font-normal">{project.status}</span>
                  )}
                </div>
                <p className="text-[#E5E5E5] text-sm leading-relaxed font-normal">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
