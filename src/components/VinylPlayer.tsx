import { TitleStrip } from "@/components/TitleStrip";
import { usePlayerStore } from "@/stores/playerStore";
import { formatTimeCompact } from "@/lib/timeUtils";
import vinylImage from "@/js/components/Assets/vinyl-parr.png";
import tonearmImage from "@/js/components/Assets/tonearm.png";
import jukeboxBg from "@/js/components/Assets/jukebox.svg";
import { Music4, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export const VinylPlayer = () => {
  const {
    nowPlaying,
    isPlaying,
    isPlayerExpanded,
    setIsPlayerExpanded,
    timeRemaining,
  } = usePlayerStore();

  const [tonearmReady, setTonearmReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousSongId, setPreviousSongId] = useState<string | undefined>();
  const [animationTriggered, setAnimationTriggered] = useState(false);

  // Handle song transitions - close player if song changes while playing
  useEffect(() => {
    if (
      nowPlaying?.id &&
      previousSongId &&
      nowPlaying.id !== previousSongId &&
      isPlayerExpanded
    ) {
      // A different song was selected while player is open
      setIsTransitioning(true);
      setIsPlayerExpanded(false);
      setAnimationTriggered(false); // Reset animation flag for new song

      // Wait for close animation, then reopen with new song
      const reopenTimer = setTimeout(() => {
        setIsPlayerExpanded(true);
        setIsTransitioning(false);
      }, 700); // Match the player close animation duration

      return () => clearTimeout(reopenTimer);
    }

    setPreviousSongId(nowPlaying?.id);
  }, [nowPlaying?.id]);

  // Animation sequence when player opens with a NEW song (runs only once per song)
  useEffect(() => {
    if (
      isPlayerExpanded &&
      nowPlaying &&
      !isTransitioning &&
      !animationTriggered &&
      isPlaying
    ) {
      // Mark that we're triggering the animation for this song
      setAnimationTriggered(true);

      // Reset tonearm position
      setTonearmReady(false);

      // Step 1: Player opens (handled by isPlayerExpanded)
      // Step 2: After 700ms, move tonearm into position
      const tonearmTimer = setTimeout(() => {
        setTonearmReady(true);
      }, 700);

      return () => {
        clearTimeout(tonearmTimer);
      };
    } else if (!isPlayerExpanded) {
      setTonearmReady(false);
      setAnimationTriggered(false); // Reset when player closes
    } else if (isPlayerExpanded && isPlaying && animationTriggered) {
      // If already animated and playing, keep tonearm in ready position
      setTonearmReady(true);
    }
  }, [
    isPlayerExpanded,
    nowPlaying?.id,
    isTransitioning,
    animationTriggered,
    isPlaying,
  ]);

  // Don't render the player if there's no song (after all hooks are called)
  if (!nowPlaying) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto w-full">
        <div
          className={`relative transition-all duration-300 ${
            isPlayerExpanded ? "h-[400px]" : "h-[100px]"
          }`}
        >
          {/* Vinyl Record - pops out behind jukebox when expanded */}
          <div
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-out ${
              isPlayerExpanded
                ? "top-[70px] w-[280px] opacity-100 sm:top-[-220px] sm:w-[420px]"
                : "top-full w-[320px] opacity-0"
            }`}
          >
            <img
              src={tonearmImage}
              alt="Tonearm"
              className={`pointer-events-none absolute -left-20 bottom-0 z-20 w-36 origin-bottom-right transition-all sm:-left-32 sm:top-20 sm:w-40 ${
                isPlayerExpanded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              } ${
                tonearmReady
                  ? "rotate-[16deg] duration-700"
                  : "rotate-0 duration-300"
              }`}
            />
            <img
              src={vinylImage}
              alt="Vinyl record"
              className={`relative w-full drop-shadow-[0_22px_36px_rgba(0,0,0,0.5)] ${
                isPlaying ? "animate-spin-slow" : ""
              }`}
            />
          </div>

          {/* Jukebox frame with controls inside */}
          <div className="absolute inset-x-0 bottom-0 overflow-hidden">
            {/* Jukebox background image - slides up/down */}
            <div
              className={`pointer-events-none absolute inset-x-0 flex items-start transition-all duration-700 ${
                isPlayerExpanded ? "top-[200px]" : "top-[38px]"
              }`}
            >
              <img
                src={jukeboxBg}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>

            {/* Controls overlay */}
            <div
              className={`flex column justify-center items-center relative z-10 transition-all duration-700 ${
                isPlayerExpanded ? "h-[400px]" : "h-[100px]"
              }`}
            >
              {isPlayerExpanded ? (
                <div className="w-full pt-[200px] flex flex-col justify-center items-center font-metropolis-bold">
                  <div className="flex items-center px-11 pt-2 justify-between text-white w-[100%]">
                    <div className="flex items-center gap-3 py-3 text-xl uppercase">
                      <Music4 className="h-6 w-6" />
                      <span>Now Playing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {timeRemaining > 0 && (
                        <div className="text-white">
                          {formatTimeCompact(timeRemaining)}
                        </div>
                      )}
                      <button
                        onClick={() => setIsPlayerExpanded(false)}
                        className="text-white transition hover:bg-white/10"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center w-full px-10">
                    <TitleStrip
                      title={
                        nowPlaying?.side === "A Side"
                          ? nowPlaying.title
                          : nowPlaying?.otherSideTitle || nowPlaying?.title || ""
                      }
                      artist={nowPlaying?.artist || "Artist Not Found"}
                      titleBottom={
                        nowPlaying?.side === "A Side"
                          ? nowPlaying?.otherSideTitle
                          : nowPlaying.title
                      }
                      songId={!nowPlaying?.otherSideId ? nowPlaying?.id : undefined}
                      isFavorited={!nowPlaying?.otherSideId ? nowPlaying?.favorite : undefined}
                      aSide={
                        nowPlaying?.otherSideId
                          ? {
                              id: nowPlaying?.side === "A Side" ? nowPlaying.id : nowPlaying.otherSideId,
                              songTitle: nowPlaying?.side === "A Side" ? nowPlaying.title : (nowPlaying.otherSideTitle || ""),
                              artist: nowPlaying.artist,
                              side: "A Side" as const,
                              albumCover: nowPlaying.albumCover,
                              albumArt: nowPlaying.albumArt,
                              favorite: nowPlaying?.side === "A Side" ? nowPlaying.favorite : nowPlaying.otherSideFavorite,
                              select: {
                                state: "off" as const,
                                selection: 0,
                                ptrains: [0, 0] as [number, number],
                                ptrainDelay: 0,
                              },
                            }
                          : undefined
                      }
                      bSide={
                        nowPlaying?.otherSideId
                          ? {
                              id: nowPlaying?.side === "B Side" ? nowPlaying.id : nowPlaying.otherSideId,
                              songTitle: nowPlaying?.side === "B Side" ? nowPlaying.title : (nowPlaying.otherSideTitle || ""),
                              artist: nowPlaying.artist,
                              side: "B Side" as const,
                              albumCover: nowPlaying.albumCover,
                              albumArt: nowPlaying.albumArt,
                              favorite: nowPlaying?.side === "B Side" ? nowPlaying.favorite : nowPlaying.otherSideFavorite,
                              select: {
                                state: "off" as const,
                                selection: 0,
                                ptrains: [0, 0] as [number, number],
                                ptrainDelay: 0,
                              },
                            }
                          : undefined
                      }
                      highlightSide={
                        nowPlaying?.side === "A Side" ? "top" : "bottom"
                      }
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsPlayerExpanded(true)}
                  className="relative flex items-end justify-between w-[85%] gap-2 text-left text-white translate-y-[12px]"
                >
                  <div className="flex items-center align-middle content-center gap-2 pt-5  font-metropolis-bold uppercase animate-fadeIn min-w-0 flex-1 overflow-hidden text-xl">
                    <Music4 className="h-6 w-6 flex-shrink-0" />
                    <div className="overflow-hidden flex-1 relative">
                      <span className="scroll-text">
                        {nowPlaying
                          ? `${nowPlaying.title} - ${nowPlaying.artist} • ${nowPlaying.title} - ${nowPlaying.artist} • `
                          : "Nothing Playing"}
                      </span>
                      {/* Fade gradients on edges */}
                      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#CA3A49] to-transparent pointer-events-none"></div>
                      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#CA3A49] to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                  <ChevronUp className="h-6 w-6 flex-shrink-0 animate-fadeIn" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
