import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Discover", to: "#discover" },
  { label: "Create event", to: "#" },
  { label: "How it works", to: "#" },
  { label: "Help", to: "#" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-[#f7f1ff]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1 md:px-12 lg:px-16">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img className="w-32 py-2" src="./navLogo.webp" alt="navbar-logo" />
          </Link>
          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.to}
                  className="text-[15px] font-medium text-[#3f3f46] transition-colors hover:text-[#6d28d9]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
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

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-lg p-2 text-[#3f3f46] transition-colors hover:bg-[#f3edff] hover:text-[#6d28d9] lg:hidden"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-[#e4d9ff] bg-[#f7f1ff] lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 md:px-12">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.to}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#3f3f46] transition-colors hover:bg-[#f3edff] hover:text-[#6d28d9]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-[#e4d9ff] px-6 py-4 md:px-12">
            <Link to="#" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-transparent text-[15px] font-semibold text-[#6d28d9] shadow-none hover:bg-[#f3edff]">
                Sign In
              </Button>
            </Link>
            <Link to="#" onClick={() => setIsOpen(false)}>
              <Button className="w-full rounded-xl bg-[#6d28d9] text-[15px] font-semibold text-white shadow-sm hover:bg-[#5b21b6]">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
