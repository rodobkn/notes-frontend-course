import { Home } from "@/components/home";

export const dynamic = "force-dynamic";

export default function RootPage() {
  const backendUrl = process.env.NOTES_BACKEND_URL!;

  return (
    <Home backendUrl={backendUrl} />
  );
}
