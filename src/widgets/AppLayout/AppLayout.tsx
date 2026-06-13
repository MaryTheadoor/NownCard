import { Outlet } from "react-router-dom";
import { Navbar } from "@/widgets/Navbar/Navbar";
import { Footer } from "@/widgets/Footer/Footer";

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
