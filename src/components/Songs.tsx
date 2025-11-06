import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Header } from "@/components/Header";
import { jukeboxData } from "@/data/jukebox.ts";
import { Disc } from "@/types";
import vinylImage from "@/js/components/Assets/vinyl.png";
import tonearmImage from "@/js/components/Assets/tonearm.png";
import jukeboxBg from "@/js/components/Assets/jukebox.svg";
import stringBg from "@/js/components/Assets/string_bg.svg";
import { Music4, Heart, Pause, Play, ChevronDown } from "lucide-react";

export const Songs = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<{
    title: string;
    artist: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  useEffect(() => {
    // Only connect to socket if backend server is available
    const newSocket = io({
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
      setSocketConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSongSelect = (disc: Disc, songIndex: number) => {
    const song = disc.disc[songIndex];
    console.log("Selected song:", song);

    setNowPlaying({ title: song.songTitle, artist: song.artist });
    setIsPlaying(true);
    setIsPlayerExpanded(true);

    if (socket && socketConnected) {
      socket.emit("direction", song.select, (response: any) => {
        console.log("Selection response:", response);
      });
    } else {
      console.log("Socket not connected - song will play locally only");
    }
  };

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-jukebox-bg relative">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      <Header nav={true} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl pb-[180px] relative z-10">
        {/* In Queue Section */}
        <section className="mb-8">
          <h2 className="text-fluid-2xl font-metropolis-bold text-jukebox-black mb-4">
            In Queue
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Example queue items */}
            {[1, 2].map((item) => (
              <div
                key={item}
                className="flex-shrink-0 bg-jukebox-red rounded-3xl p-4 w-80 flex items-center gap-4 shadow-lg"
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center flex-shrink-0 relative">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-jukebox-red rounded-full"></div>
                  </div>
                </div>
                <div className="text-white min-w-0">
                  <p className="font-metropolis-bold text-fluid-lg truncate">
                    Roberta Flack
                  </p>
                  <p className="font-metropolis text-fluid-sm truncate">
                    Killing Me Softly...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Played Section */}
        <section className="mb-8">
          <h2 className="text-fluid-2xl font-metropolis-bold text-jukebox-black mb-4">
            Recently Played
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {jukeboxData.slice(0, 3).map((disc, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-48 rounded-3xl overflow-hidden shadow-lg relative bg-black"
              >
                <img
                  src={disc.disc[0].albumCover || vinylImage}
                  alt={`${disc.disc[0].artist} album`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Songs/Favorites Section */}
        <section>
          <h2 className="text-fluid-2xl font-metropolis-bold text-jukebox-black mb-4">
            Songs
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {jukeboxData.flatMap((disc, discIndex) =>
              disc.disc.map((song, songIndex) => (
                <button
                  key={`${discIndex}-${songIndex}`}
                  onClick={() => handleSongSelect(disc, songIndex)}
                  className="group relative aspect-square overflow-hidden rounded-3xl bg-black shadow-lg transition-transform hover:scale-105"
                >
                  <img
                    src={song.albumCover || vinylImage}
                    alt={song.songTitle}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 p-4 text-center text-white">
                    <p className="font-metropolis-bold text-sm mb-1 line-clamp-2">
                      {song.songTitle}
                    </p>
                    <p className="font-metropolis text-xs line-clamp-1">
                      {song.artist}
                    </p>
                  </div>
                  <span className="absolute left-2 top-2 text-xs font-metropolis-bold text-white">
                    A{songIndex + 1}
                  </span>
                </button>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Vinyl Player at Bottom */}
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
                className={`pointer-events-none absolute -left-20 bottom-0 z-20 w-36 origin-bottom-right transition-all duration-700 sm:-left-32 sm:top-20 sm:w-40 ${
                  isPlayerExpanded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                } ${
                  isPlayerExpanded && isPlaying ? "rotate-[16deg]" : "rotate-0"
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
                  className="h-full w-auto w-full object-contain"
                />
              </div>

              {/* Controls overlay */}
              <div
                className={`relative z-10  transition-all duration-700 ${
                  isPlayerExpanded ? "h-[400px]" : "h-[100px]"
                }`}
              >
                {isPlayerExpanded ? (
                  <div className="w-full pt-[200px]">
                    <div className="flex items-center px-11 pb-2 justify-between text-white">
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
                      <div className="w-full max-w-[330px] py-2 rounded-[12px] bg-[#f6ccd6] text-center">
                        <p className="font-metropolis-bold text-xl sm:text-2xl tracking-tight font-bold">
                          {nowPlaying?.title || "Song Not Found"}
                        </p>

                        <div className="relative mx-auto my-2 flex w-full items-center justify-center">
                          <img
                            src={stringBg}
                            alt=""
                            className="w-full object-contain"
                          />
                          <span className="absolute flex items-center justify-center font-metropolis-bold font-bold text-lg sm:text-xl text-jukebox-black">
                            {nowPlaying?.artist || "Artist Not Found"}
                          </span>
                        </div>

                        <p className="font-metropolis-bold text-xl sm:text-2xl font-bold">
                          {nowPlaying?.title || "Song Not Found"}
                        </p>
                      </div>
                    </div>
                    <div className="flex absolute bottom-[35px] w-full items-center justify-between text-lg font-metropolis-bold px-[60px]  text-jukebox-black">
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

                      <button
                        className="text-jukebox-red transition hover:text-[#b73145]"
                        aria-label="Favorite"
                      >
                        <Heart className="h-6 w-6" strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsPlayerExpanded(true)}
                    className="relative flex items-end justify-between gap-4 px-8 text-left text-white translate-y-[12px]"
                  >
                    <div className="flex items-center gap-3 pt-10 text-base font-metropolis-bold uppercase font-bold tracking-[0.6em] animate-fadeIn">
                      <Music4 className="h-6 w-6" />
                      <span className="truncate">
                        {" "}
                        {nowPlaying
                          ? `${nowPlaying.title} - ${nowPlaying.artist}`
                          : "Nothing Playing"}
                      </span>
                    </div>
                    <ChevronDown className="h-6 w-6 flex-shrink-0 animate-fadeIn" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
