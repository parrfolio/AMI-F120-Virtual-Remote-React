import stringBg from "@/js/components/Assets/string_bg.svg";
import { Song, SongSelection } from "@/types";

interface TitleStripProps {
  title: string;
  artist: string;
  titleBottom?: string; // Optional bottom title for A/B side display
  className?: string;
  song?: Song; // Full song object for hardware control
  onSelect?: (selection: SongSelection) => void; // Callback when strip is clicked
  clickable?: boolean; // Whether the strip should be clickable
}

export const TitleStrip = ({
  title,
  artist,
  titleBottom,
  className = "",
  song,
  onSelect,
  clickable = false,
}: TitleStripProps) => {
  const handleClick = () => {
    console.log("=== TitleStrip clicked ===");
    console.log("Clickable:", clickable);
    console.log("Has song:", !!song);
    console.log("Song data:", song);
    console.log("Has onSelect:", !!onSelect);

    if (clickable && song && onSelect) {
      if (!song.select) {
        console.error("ERROR: Song is missing 'select' property!", song);
        return;
      }
      console.log("TitleStrip - sending selection:", song.select);
      onSelect(song.select);
    } else {
      console.log("TitleStrip - click conditions not met");
    }
  };

  return (
    <div
      className={`w-full py-2 rounded-[12px] bg-[#f6ccd6] text-center ${className} ${
        clickable
          ? "cursor-pointer hover:bg-[#f4b8c8] transition-colors active:scale-95"
          : ""
      }`}
      onClick={handleClick}
    >
      <p className="font-metropolis-bold text-xl sm:text-2xl tracking-tight font-bold">
        {title}
      </p>

      <div className="relative mx-auto my-2 flex w-full items-center justify-center">
        <img src={stringBg} alt="" className="w-full object-contain" />
        <span className="absolute flex items-center justify-center font-metropolis-bold font-bold text-lg sm:text-xl text-jukebox-black">
          {artist}
        </span>
      </div>

      <p className="font-metropolis-bold text-xl sm:text-2xl font-bold">
        {titleBottom || title}
      </p>
    </div>
  );
};
