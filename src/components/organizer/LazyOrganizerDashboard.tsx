import { lazy, Suspense } from "react";

const OrganizerDashboard = lazy(() => import("@/pages/OrganizerDashboard"));

const LazyOrganizerDashboard = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ff] text-[#6d28d9]">
        Loading dashboard...
      </div>
    }
  >
    <OrganizerDashboard />
  </Suspense>
);

export default LazyOrganizerDashboard;
