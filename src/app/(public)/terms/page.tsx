import { Metadata } from "next";
import { getMarkdownContent } from "@/lib/markdown";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getMarkdownContent("terms-of-service");
  return {
    title: content.title as string,
    description: content.description as string,
  };
}

export default async function TermsOfServicePage() {
  const content = await getMarkdownContent("terms-of-service");
  
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div 
        className="prose prose-gray dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content.contentHtml }}
      />
    </main>
  );
}