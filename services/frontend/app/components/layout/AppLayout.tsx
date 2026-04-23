import { Outlet } from "react-router";
import { Navbar } from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
        <Outlet />
      </main>
    </div>
  );
}
