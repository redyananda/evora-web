import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="w-full bg-[#f7f1ff]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1 md:px-12 lg:px-16">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img className="w-32 py-2" src="./navLogo.webp" alt="navbar-logo" />
          </Link>
          <ul className="flex items-center gap-8">
            <li>
              <a
                href="#discover"
                className="text-[15px] font-medium text-[#3f3f46] transition-colors hover:text-[#6d28d9]"
              >
                Discover
              </a>
            </li>
            <li>
              <Link
                to="#"
                className="text-[15px] font-medium text-[#3f3f46] transition-colors hover:text-[#6d28d9]"
              >
                Create event
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-[15px] font-medium text-[#3f3f46] transition-colors hover:text-[#6d28d9]"
              >
                How it works
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-[15px] font-medium text-[#3f3f46] transition-colors hover:text-[#6d28d9]"
              >
                Help
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <Link to="#">
            <Button className="bg-transparent px-4 text-[15px] font-semibold text-[#6d28d9] shadow-none hover:bg-[#f3edff]">
              Sign In
            </Button>
          </Link>
          <Link to="#">
            <Button className="rounded-xl bg-[#6d28d9] px-6 text-[15px] font-semibold text-white shadow-sm hover:bg-[#5b21b6]">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
