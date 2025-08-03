import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import { ArrowRightIcon, WandSparklesIcon } from "lucide-react";

const Home = () => {
  return (
    <main className="">
      <section className="bg-primary text-primary-foreground">
        <div className="dark container max-w-screen-lg py-24 h-screen flex flex-col md:items-center justify-center md:text-center space-y-4">
          <Badge className="mb-8">
            <WandSparklesIcon />
            Beta Version
          </Badge>
          <h1 className="text-4xl/tight md:text-7xl/tight font-black">
            One stop solution for all healthcare services
          </h1>
          <p className="md:text-lg/tight max-w-prose mx-auto text-muted-foreground text-pretty">
            We provide a wide range of healthcare services to meet your needs.
            Our team of experienced professionals is dedicated to providing you
            with the best possible care.
          </p>
          <div className="w-full mt-8 flex max-md:flex-col items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton>
                <Button size="lg" className="max-md:w-full">
                  <ArrowRightIcon />
                  Let&apos;s get started
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button size="lg" variant="secondary" className="max-md:w-full">
                  Already have an account?
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="max-md:w-full">
                Go to Dashboard
              </Button>
              <SignOutButton>
                <Button size="lg" variant="secondary" className="max-md:w-full">
                  Sign Out
                </Button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
