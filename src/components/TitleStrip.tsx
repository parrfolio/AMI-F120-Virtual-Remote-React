import stringBg from "@/js/components/Assets/string_bg.svg";
import { Song, SongSelection } from "@/types";
import { HeartButton } from "@/components/HeartButton";
import { Volume2 } from "lucide-react";

interface TitleStripProps {
  title: string;
  artist: string;
  titleBottom?: string; // Optional bottom title for A/B side display
  className?: string;
  song?: Song; // Legacy: Full song object for hardware control (deprecated, use aSide/bSide)
  aSide?: Song; // A-side song for dual selection
  bSide?: Song; // B-side song for dual selection
  displayIndexASide?: number; // Sequential display index for A-side (1-120)
  displayIndexBSide?: number; // Sequential display index for B-side (1-120)
  onSelect?: (selection: SongSelection) => void; // Legacy callback (deprecated, use onSelectASide/onSelectBSide)
  onSelectASide?: (selection: SongSelection) => void; // Callback for A-side
  onSelectBSide?: (selection: SongSelection) => void; // Callback for B-side
  clickable?: boolean; // Whether the strip should be clickable
  songId?: string; // Song ID for favorite functionality
  isFavorited?: boolean; // Whether the song is favorited
  highlightSide?: "top" | "bottom"; // Which side to highlight as currently playing
}

export const TitleStrip = ({
  title,
  artist,
  titleBottom,
  className = "",
  song,
  aSide,
  bSide,
  displayIndexASide,
  displayIndexBSide,
  onSelect,
  onSelectASide,
  onSelectBSide,
  clickable = false,
  songId,
  isFavorited,
  highlightSide,
}: TitleStripProps) => {
  // Legacy single-click handler
  const handleClick = () => {
    console.log("=== TitleStrip clicked (legacy) ===");
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

  // New dual-click handlers
  const handleASideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("=== A-Side clicked ===");
    if (clickable && aSide && onSelectASide) {
      if (!aSide.select) {
        console.error("ERROR: A-Side is missing 'select' property!", aSide);
        return;
      }
      console.log("TitleStrip - sending A-Side selection:", aSide.select);
      onSelectASide(aSide.select);
    }
  };

  const handleBSideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("=== B-Side clicked ===");
    if (clickable && bSide && onSelectBSide) {
      if (!bSide.select) {
        console.error("ERROR: B-Side is missing 'select' property!", bSide);
        return;
      }
      console.log("TitleStrip - sending B-Side selection:", bSide.select);
      onSelectBSide(bSide.select);
    }
  };

  // Use dual selection if aSide/bSide are provided (for displaying hearts)
  // Use clickable dual mode only if both callbacks are provided
  const hasDualSongs = aSide || bSide;
  const useDualClickMode = onSelectASide && onSelectBSide;

  return (
    <div
      className={`w-full py-2 rounded-[12px] bg-[#f6ccd6] text-center relative ${className}`}
      onClick={useDualClickMode ? undefined : handleClick}
    >
      {/* Legacy single heart for non-dual mode */}
      {!hasDualSongs && songId && (
        <div className="absolute top-2 right-2 z-10">
          <HeartButton
            songId={songId}
            isFavorited={isFavorited}
            className="transition hover:opacity-80"
          />
        </div>
      )}

      <div
        className={`${
          useDualClickMode && clickable
            ? "cursor-pointer hover:bg-[#f4b8c8] transition-colors active:scale-[0.98] rounded-t-[12px] py-0"
            : "py-0"
        } px-4 rounded-t-[12px] relative flex items-center justify-center`}
        onClick={useDualClickMode ? handleASideClick : undefined}
      >
        {/* A-side selection number */}
        {displayIndexASide && (
          <div className="absolute left-2 top-2">
            <span className="font-metropolis-bold text-sm text-jukebox-black">
              S{displayIndexASide}
            </span>
          </div>
        )}
        {highlightSide === "top" && (
          <Volume2 className="absolute left-2 h-5 w-5 text-jukebox-red" />
        )}
        {/* A-side heart button */}
        {aSide?.id && (
          <div className="absolute right-2 z-10">
            <HeartButton
              songId={aSide.id}
              isFavorited={aSide.favorite}
              className="transition hover:opacity-80"
            />
          </div>
        )}
        <p className="font-metropolis-bold text-xl sm:text-2xl tracking-tight font-bold truncate">
          {title}
        </p>
      </div>

      <div className="relative mx-auto my-2 flex w-full items-center justify-center">
        <img src={stringBg} alt="" className="w-full object-contain" />
        <span className="absolute left-1/2 -translate-x-1/2 font-metropolis-bold font-bold text-lg sm:text-xl text-jukebox-black max-w-[50%] truncate px-2 text-center">
          {artist}
        </span>
      </div>

      <div
        className={`${
          useDualClickMode && clickable
            ? "cursor-pointer hover:bg-[#f4b8c8] transition-colors active:scale-[0.98] rounded-b-[12px] py-0"
            : "py-0"
        } px-4 rounded-b-[12px] relative flex items-center justify-center`}
        onClick={useDualClickMode ? handleBSideClick : undefined}
      >
        {/* B-side selection number */}
        {displayIndexBSide && (
          <div className="absolute left-2 top-2">
            <span className="font-metropolis-bold text-sm text-jukebox-black">
              S{displayIndexBSide}
            </span>
          </div>
        )}
        {highlightSide === "bottom" && (
          <Volume2 className="absolute left-2 h-5 w-5 text-jukebox-red" />
        )}
        {/* B-side heart button */}
        {bSide?.id && (
          <div className="absolute right-2 z-10">
            <HeartButton
              songId={bSide.id}
              isFavorited={bSide.favorite}
              className="transition hover:opacity-80"
            />
          </div>
        )}
        <p className="font-metropolis-bold text-xl sm:text-2xl font-bold truncate">
          {titleBottom || title}
        </p>
      </div>
    </div>
  );
};
