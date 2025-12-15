import { Link } from "react-router-dom";
import { Icon45 } from "@/components/icons/Icon45";
import { LightsIcon } from "@/components/icons/LightsIcon";
import AmiLogo from "@/js/components/Assets/AmiLogo.png";

interface HeaderProps {
  nav?: boolean;
}

export const Header = ({ nav = false }: HeaderProps) => {
  return (
    <header className="bg-jukebox-red fixed w-full z-30 h-[90px] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-0 relative">
        {nav ? (
          <Link
            to="/songs"
            className="flex flex-col items-center gap-0 text-center "
          >
            <div className="flex h-14 w-14 items-center justify-center">
              <Icon45 className="h-auto w-full" color="#FFFFFF" />
            </div>
            <span className="font-metropolis-bold uppercase text-fluid-sm">
              Songs
            </span>
          </Link>
        ) : (
          <span className="h-14 w-14" />
        )}

        <Link
          to="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 "
        >
          <img
            src={AmiLogo}
            alt="AMi Logo"
            className="h-[100px] w-auto object-contain"
          />
        </Link>

        {nav ? (
          <Link
            to="/lights"
            className="flex flex-col items-center pt-6 justify-end gap-4 text-center"
          >
            <div className="flex h-5 w-7 items-center justify-end">
              <LightsIcon className="h-auto w-full" color="#FFFFFF" />
            </div>
            <span className="font-metropolis-bold uppercase text-fluid-sm">
              Lights
            </span>
          </Link>
        ) : (
          <span className="h-14 w-14" />
        )}
      </div>

      {/* {nav && user.firstName && (
        <div className="border-t border-white border-opacity-20">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
            <span className="font-metropolis">
              {user.firstName} {user.lastName}
            </span>
            <div className="flex items-center gap-4">
              <Link to="/manage" className="font-metropolis hover:underline">
                Manage
              </Link>
              <button
                onClick={handleLogout}
                className="font-metropolis hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )} */}
    </header>
  );
};
