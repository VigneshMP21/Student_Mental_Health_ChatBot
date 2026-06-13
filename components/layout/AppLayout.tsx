import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 min-h-0 lg:pl-64">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 pt-24 sm:pt-28 lg:p-8 lg:pt-8 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
