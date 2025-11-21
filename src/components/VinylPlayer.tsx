import { TitleStrip } from "@/components/TitleStrip";
import { HeartButton } from "@/components/HeartButton";
import { usePlayerStore } from "@/stores/playerStore";
import vinylImage from "@/js/components/Assets/vinyl.png";
import tonearmImage from "@/js/components/Assets/tonearm.png";
import jukeboxBg from "@/js/components/Assets/jukebox.svg";
import { Music4, Pause, Play, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export const VinylPlayer = () => {
  const {
    nowPlaying,
    isPlaying,
    isPlayerExpanded,
    togglePlayback,
    setIsPlayerExpanded,
    setIsPlaying,
  } = usePlayerStore();

  const [tonearmReady, setTonearmReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousSongId, setPreviousSongId] = useState<string | undefined>();

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

      // Wait for close animation, then reopen with new song
      const reopenTimer = setTimeout(() => {
        setIsPlayerExpanded(true);
        setIsTransitioning(false);
      }, 700); // Match the player close animation duration

      return () => clearTimeout(reopenTimer);
    }

    setPreviousSongId(nowPlaying?.id);
  }, [nowPlaying?.id]);

  // Animation sequence when player opens with a song
  useEffect(() => {
    if (isPlayerExpanded && nowPlaying && !isTransitioning) {
      // Reset states
      setTonearmReady(false);
      setIsPlaying(false);

      // Step 1: Player opens (handled by isPlayerExpanded)
      // Step 2: After 700ms, move tonearm into position
      const tonearmTimer = setTimeout(() => {
        setTonearmReady(true);
      }, 700);

      // Step 3: After 1400ms total, start playing
      const playTimer = setTimeout(() => {
        setIsPlaying(true);
      }, 1400);

      return () => {
        clearTimeout(tonearmTimer);
        clearTimeout(playTimer);
      };
    } else if (!isPlayerExpanded) {
      setTonearmReady(false);
    }
  }, [isPlayerExpanded, nowPlaying?.id, isTransitioning]);

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
                <div className="w-full pt-[200px] flex flex-col justify-center items-center">
                  <div className="flex items-center px-11 pt-0 justify-between text-white w-[90%]">
                    <div className="flex items-center gap-3 py-3 text-xl font-metropolis-bold uppercase font-bold tracking-[0.6em]">
                      <Music4 className="h-6 w-6" />
                      <span>Now Playing</span>
                    </div>
                    <button
                      onClick={() => setIsPlayerExpanded(false)}
                      className="text-white transition hover:bg-white/10"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center">
                    <TitleStrip
                      title={nowPlaying?.title || "Song Not Found"}
                      artist={nowPlaying?.artist || "Artist Not Found"}
                    />
                  </div>
                  <div className="flex absolute bottom-[35px] w-full items-center justify-between text-lg font-metropolis-bold px-[60px] text-jukebox-black">
                    <button
                      onClick={togglePlayback}
                      className="flex items-center gap-2 text-jukebox-red transition hover:text-[#b73145]"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" strokeWidth={3} />
                      ) : (
                        <Play className="h-6 w-6" strokeWidth={3} />
                      )}
                    </button>

                    <HeartButton
                      songId={nowPlaying?.id}
                      isFavorited={nowPlaying?.favorite}
                      className="transition hover:opacity-80"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsPlayerExpanded(true)}
                  className="relative flex items-end justify-between w-[80%] gap-10 text-left text-white translate-y-[12px]"
                >
                  <div className="flex items-center align-middle content-center gap-3 pt-5 text-base font-metropolis-bold uppercase font-bold tracking-[0.6em] animate-fadeIn min-w-0 flex-1">
                    <Music4 className="h-6 w-6 flex-shrink-0" />
                    <span className="truncate">
                      {nowPlaying
                        ? `${nowPlaying.title} - ${nowPlaying.artist}`
                        : "Nothing Playing"}
                    </span>
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
