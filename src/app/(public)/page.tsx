import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main>
      <section className="h-screen container flex items-center justify-center font-mono">
        <div className="space-y-1">
          <h1 className="text-5xl md:text-7xl xl:text-9xl">
            Welcome to Vylune
          </h1>
          <p className="text-xl text-pretty">
            On the mission to build a 21st Century Healthcare System
          </p>
          <Button size="lg" className="mt-4 w-full md:w-fit text-lg">
            Let&apos;s get started!
          </Button>
        </div>
      </section>
    </main>
  );
}
