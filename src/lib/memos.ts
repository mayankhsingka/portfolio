import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Memo {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string[]; // Splitting markdown into paragraphs
}

const memosDirectory = path.join(process.cwd(), "content/memos");

export function getAllMemos(): Memo[] {
  if (!fs.existsSync(memosDirectory)) return [];
  
  const fileNames = fs.readdirSync(memosDirectory);
  const allMemos = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(memosDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    // Split content by double newlines to emulate paragraphs
    const content = matterResult.content
      .split("\n\n")
      .map(p => p.trim())
      .filter(p => p.length > 0);

    return {
      slug,
      title: matterResult.data.title || "Untitled",
      date: matterResult.data.date || "1970-01-01",
      tags: matterResult.data.tags || [],
      excerpt: matterResult.data.excerpt || "",
      content,
    };
  });

  return allMemos.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getMemoBySlug(slug: string): Memo | null {
  const fullPath = path.join(memosDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const content = matterResult.content
    .split("\n\n")
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return {
    slug,
    title: matterResult.data.title || "Untitled",
    date: matterResult.data.date || "1970-01-01",
    tags: matterResult.data.tags || [],
    excerpt: matterResult.data.excerpt || "",
    content,
  };
}
