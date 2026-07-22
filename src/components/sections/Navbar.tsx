import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { LayoutDashboard, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

const navLinks = [
  { label: "Discover", to: "/#discover" },
<<<<<<< Updated upstream
  { label: "Create event", to: "/events/create" },
=======
>>>>>>> Stashed changes
  { label: "How it works", to: "/how-it-works" },
  { label: "Help", to: "#" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setIsOpen(false);
  };

  return (
    <div className="w-full bg-[#f7f1ff]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1 md:px-12 lg:px-16">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img className="w-32 py-2" src="/navLogo.webp" alt="navbar-logo" />
          </Link>
          <ul className="hidden items-center gap-8 lg:flex">
            <li>
              <a href={user?.userRole === "ORGANIZER" ? "/organizer?tab=events" : "/register"} className="text-[15px] font-medium text-[#3f3f46] transition-colors hover:text-[#6d28d9]">
                Create event
              </a>
            </li>
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

        {/* Desktop right section */}
        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated && user ? (
            <>
              {user.userRole === "ORGANIZER" && (
                <Link to="/organizer" className="flex items-center gap-1.5 rounded-xl bg-[#6d28d9] px-3 py-2 text-sm font-semibold text-white hover:bg-[#5b21b6]">
                  <LayoutDashboard className="size-4" /> Dashboard
                </Link>
              )}
              {/* User greeting */}
              <Link to="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#3f3f46] transition-colors hover:bg-white">
                {user.profilePicture ? <img src={user.profilePicture} alt="" className="size-7 rounded-full object-cover" /> : <User className="size-4 text-[#6d28d9]" />}
                <span className="font-medium">{user.firstName}</span>
                <span className="rounded-full bg-[#f3edff] px-2 py-0.5 text-xs font-semibold text-[#6d28d9]">
                  {user.userRole === "ORGANIZER" ? "Organizer" : "Customer"}
                </span>
              </Link>
              {/* Referral code badge */}
              {user.referralCode && (
                <button
                  type="button"
                  title="Click to copy the referral code"
                  onClick={() => {
                    if (user.referralCode) {
                      navigator.clipboard.writeText(user.referralCode);
                      toast.success("Referral code copied!");
                    }
                  }}
                  className="rounded-lg border border-[#e4d9ff] bg-white px-3 py-1.5 text-xs font-mono font-medium text-[#6d28d9] transition-colors hover:bg-[#f3edff]"
                >
                  {user.referralCode}
                </button>
              )}
              {/* Logout */}
              <Button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl bg-transparent px-4 text-[15px] font-semibold text-[#6d28d9] shadow-none hover:bg-[#f3edff]"
              >
                <LogOut className="size-4" />
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button className="bg-transparent px-4 text-[15px] font-semibold text-[#6d28d9] shadow-none hover:bg-[#f3edff]">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-xl bg-[#6d28d9] px-6 text-[15px] font-semibold text-white shadow-sm hover:bg-[#5b21b6]">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-[#e4d9ff] bg-[#f7f1ff] lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 md:px-12">
            <li>
              <a href={user?.userRole === "ORGANIZER" ? "/organizer?tab=events" : "/register"} onClick={() => setIsOpen(false)} className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#3f3f46] transition-colors hover:bg-[#f3edff] hover:text-[#6d28d9]">
                Create event
              </a>
            </li>
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
            {isAuthenticated && user ? (
              <>
                {user.userRole === "ORGANIZER" && (
                  <Link to="/organizer" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 rounded-xl bg-[#6d28d9] px-4 py-2.5 text-sm font-semibold text-white">
                    <LayoutDashboard className="size-4" /> Organizer Dashboard
                  </Link>
                )}
                {/* User info */}
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#3f3f46] hover:bg-white">
                  {user.profilePicture ? <img src={user.profilePicture} alt="" className="size-7 rounded-full object-cover" /> : <User className="size-4 text-[#6d28d9]" />}
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                  <span className="ml-auto rounded-full bg-[#f3edff] px-2 py-0.5 text-xs font-semibold text-[#6d28d9]">
                    {user.userRole === "ORGANIZER" ? "Organizer" : "Customer"}
                  </span>
                </Link>
                {/* Referral code */}
                {user.referralCode && (
                  <button
                    type="button"
                    onClick={() => {
                      if (user.referralCode) {
                        navigator.clipboard.writeText(user.referralCode);
                        toast.success("Referral code copied!");
                      }
                    }}
                    className="flex items-center justify-between rounded-lg border border-[#e4d9ff] bg-white px-3 py-2 text-left text-sm"
                  >
                    <span className="text-[#71717a]">Referral Code</span>
                    <span className="font-mono font-medium text-[#6d28d9]">
                      {user.referralCode}
                    </span>
                  </button>
                )}
                {/* Logout */}
                <Button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-xl bg-transparent text-[15px] font-semibold text-[#6d28d9] shadow-none hover:bg-[#f3edff]"
                >
                  <LogOut className="size-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-transparent text-[15px] font-semibold text-[#6d28d9] shadow-none hover:bg-[#f3edff]">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-xl bg-[#6d28d9] text-[15px] font-semibold text-white shadow-sm hover:bg-[#5b21b6]">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
