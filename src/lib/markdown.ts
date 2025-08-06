import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const markdownDirectory = path.join(process.cwd(), 'content');

export async function getMarkdownContent(filename: string) {
  const fullPath = path.join(markdownDirectory, `${filename}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the filename and contentHtml
  return {
    filename,
    contentHtml,
    title: matterResult.data.title as string | undefined,
    description: matterResult.data.description as string | undefined,
    lastUpdated: matterResult.data.lastUpdated as string | undefined,
    ...matterResult.data,
  };
}

export function getAllMarkdownFiles() {
  try {
    const fileNames = fs.readdirSync(markdownDirectory);
    return fileNames
      .filter((name) => name.endsWith('.md'))
      .map((name) => name.replace(/\.md$/, ''));
  } catch {
    return [];
  }
}