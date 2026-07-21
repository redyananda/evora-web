import { Link } from "react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f7f1ff] px-4 text-center">
      <ShieldAlert className="size-16 text-[#6d28d9]" />
      <div>
        <h1 className="text-3xl font-bold text-[#18181b]">Access Denied</h1>
        <p className="mt-2 text-[#71717a]">
          You do not have permission to access this page.
        </p>
      </div>
      <Link to="/">
        <Button className="rounded-xl bg-[#6d28d9] px-6 text-white hover:bg-[#5b21b6]">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default Unauthorized;
