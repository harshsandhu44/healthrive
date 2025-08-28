import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="container font-mono h-screen flex items-center justify-center">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle className="text-4xl">Login to your account</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
