"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

const blogPosts: Record<string, { title: string; content: string; date: string }> = {
  perspectives: {
    title: "PERSPECTIVES",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    content: `
      Exploring the intersection of technology and human experience through thoughtful reflection and analysis.
      
      This is where I share my thoughts on how technology shapes our world, influences our decisions, and transforms our daily lives. Through careful observation and critical thinking, I aim to provide unique perspectives on the digital landscape we navigate.
    `,
  },
  "mortality-is-insanity": {
    title: "MORTALITY IS INSANITY",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    content: `
      A philosophical exploration of existence, consciousness, and the paradox of mortality in the digital age.
      
      In a world where our digital footprints may outlive our physical existence, we are forced to confront fundamental questions about what it means to be alive, to exist, and to leave a legacy. This piece delves into the absurdity and beauty of our finite existence in an infinite digital universe.
    `,
  },
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-mono">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#E5E5E5] hover:text-[#0F52BA] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>back</span>
        </Link>

        <article>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-[#1B4F9E] to-[#0F52BA]"></div>
            <h1 className="text-2xl font-semibold text-[#E5E5E5]">{post.title}</h1>
          </div>
          <p className="text-sm text-[#999] mb-8">{post.date}</p>
          <div className="prose prose-invert max-w-none">
            <p className="text-[#E5E5E5] leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
