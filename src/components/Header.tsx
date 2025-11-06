import { Link } from "react-router-dom";
import { Disc3, Sun } from "lucide-react";
import { logout } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";
import AmiLogo from "@/js/components/Assets/AmiLogo.png";

interface HeaderProps {
  nav?: boolean;
}

export const Header = ({ nav = false }: HeaderProps) => {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-jukebox-red text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 relative">
        {nav ? (
          <Link
            to="/songs"
            className="flex flex-col items-center gap-2 text-center transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-jukebox-red shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
              <Disc3 className="h-7 w-7" />
            </div>
            <span className="text-[0.65rem] font-metropolis-bold uppercase tracking-[0.3em]">
              120 Songs
            </span>
          </Link>
        ) : (
          <span className="h-14 w-14" />
        )}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <img
            src={AmiLogo}
            alt="AMi Logo"
            className="h-20 w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.32)]"
          />
        </div>

        {nav ? (
          <Link
            to="/lights"
            className="flex flex-col items-center gap-2 text-center transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-jukebox-red shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
              <Sun className="h-7 w-7" />
            </div>
            <span className="text-[0.65rem] font-metropolis-bold uppercase tracking-[0.3em]">
              Lights
            </span>
          </Link>
        ) : (
          <span className="h-14 w-14" />
        )}
      </div>

      {nav && user.firstName && (
        <div className="border-t border-white border-opacity-20">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
            <span className="font-metropolis">
              {user.firstName} {user.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="font-metropolis hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
