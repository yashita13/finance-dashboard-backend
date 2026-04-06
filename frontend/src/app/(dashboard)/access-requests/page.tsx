import { AccessRequestsTable } from "@/features/access-request/AccessRequestsTable";

export default function AccessRequestsPage() {
  return (
    <main className="flex-1 w-full p-4 md:p-8 lg:p-12 pb-24 overflow-y-auto main-scroll">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Access Control</h1>
          <p className="text-white/60 text-sm">Manage incoming role elevation requests.</p>
        </div>
        
        <AccessRequestsTable />
      </div>
    </main>
  );
}
