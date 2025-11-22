import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TitleStrip } from "@/components/TitleStrip";
import { VinylPlayer } from "@/components/VinylPlayer";
import { HeartButton } from "@/components/HeartButton";
import { useJukeboxStore } from "@/stores/jukeboxStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useLightsStore } from "@/stores/lightsStore";
import { animationThemes } from "@/data/animations.ts";
import {
  Song,
  SongSelection,
  SocketLightsData,
  SocketDirectionResponse,
} from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";

export const Songs = () => {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([0, 1])
  );

  const { jukeboxData, loading, fetchSongs } = useJukeboxStore();
  const {
    socket,
    socketConnected,
    setNowPlaying,
    setIsPlayerExpanded,
    setIsPlaying,
  } = usePlayerStore();
  const { running: lightsRunning, animation } = useLightsStore();

  const handleSongSelect = (selection: SongSelection, song: Song) => {
    console.log("=== handleSongSelect called ===");
    console.log("Song:", song);
    console.log("Selection:", selection);
    console.log("Socket:", socket ? "connected" : "not connected");
    console.log("Socket connected state:", socketConnected);

    setNowPlaying({
      id: song.id,
      title: song.songTitle,
      artist: song.artist,
      favorite: song.favorite,
    });
    setIsPlaying(true);
    setIsPlayerExpanded(true);

    if (socket && socketConnected) {
      console.log("Socket is available - sending direction event");
      // If lights are running, turn them off before sending pulse train
      if (lightsRunning && animation) {
        const lightData: SocketLightsData = {
          state: "off",
          animation: animation,
          stripConf: animationThemes[animation],
        };

        socket.emit("lights", lightData, () => {
          // Send pulse train to jukebox hardware
          socket.emit(
            "direction",
            selection,
            (callback: SocketDirectionResponse) => {
              if (callback.done) {
                // Turn lights back on after pulse train completes
                const lightDataOn: SocketLightsData = {
                  state: "on",
                  animation: animation,
                  stripConf: animationThemes[animation],
                };
                socket.emit("lights", lightDataOn);
              }
            }
          );
        });
      } else {
        // No lights running, just send the pulse train
        socket.emit(
          "direction",
          selection,
          (response: SocketDirectionResponse) => {
            console.log("Selection response:", response);
          }
        );
      }
    } else {
      console.log("Socket not connected - song will play locally only");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Group discs into sections of 5 pairs (10 songs)
  const allDiscs = jukeboxData.map((disc, discIndex) => {
    const aSide = disc.disc.find((s) => s.side === "A Side");
    const bSide = disc.disc.find((s) => s.side === "B Side");
    return {
      discIndex,
      aSide: aSide || disc.disc[0],
      bSide: bSide || disc.disc[1],
    };
  });

  const sections = allDiscs.reduce((acc, disc, index) => {
    const sectionIndex = Math.floor(index / 5); // 5 discs (10 songs) per section
    if (!acc[sectionIndex]) {
      acc[sectionIndex] = [];
    }
    acc[sectionIndex].push(disc);
    return acc;
  }, [] as Array<Array<{ discIndex: number; aSide: Song; bSide: Song }>>);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getSectionRange = (index: number) => {
    const start = index * 10 + 1;
    const end = Math.min((index + 1) * 10, allDiscs.length * 2);
    return `${start}-${end}`;
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
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-4xl pb-[200px] relative z-10">
        <h1 className="sr-only">All Songs</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg font-metropolis text-gray-600">
              Loading songs...
            </p>
          </div>
        ) : allDiscs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-metropolis-bold text-gray-600">
              No songs available
            </p>
            <p className="text-gray-500 font-metropolis mt-2">
              Add songs using the song manager
            </p>
          </div>
        ) : (
          <>
            {/* Accordion Sections */}
            {sections.map((sectionDiscs, sectionIndex) => (
              <section key={sectionIndex} className="mb-6">
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className="flex items-center gap-4 mb-4 w-full text-left group"
                  aria-expanded={expandedSections.has(sectionIndex)}
                >
                  <h2 className="text-5xl font-metropolis-bold text-jukebox-black group-hover:text-jukebox-red transition-colors">
                    {getSectionRange(sectionIndex)}
                  </h2>
                  {expandedSections.has(sectionIndex) ? (
                    <ChevronUp className="h-8 w-8 text-jukebox-black group-hover:text-jukebox-red transition-colors" />
                  ) : (
                    <ChevronDown className="h-8 w-8 text-jukebox-black group-hover:text-jukebox-red transition-colors" />
                  )}
                </button>

                {expandedSections.has(sectionIndex) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sectionDiscs.map((disc) => (
                      <div key={disc.discIndex} className="relative group">
                        <TitleStrip
                          title={disc.aSide.songTitle}
                          artist={disc.aSide.artist}
                          titleBottom={disc.bSide?.songTitle}
                          song={disc.aSide}
                          onSelect={(selection) =>
                            handleSongSelect(selection, disc.aSide)
                          }
                          clickable={true}
                          className="w-full max-w-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border-2 border-jukebox-red group-hover:shadow-[0_6px_20px_rgba(231,64,83,0.4)] transition-shadow"
                        />

                        {/* Favorite Heart Toggle - favorites the A-side (represents the disc) */}
                        <HeartButton
                          songId={disc.aSide.id}
                          isFavorited={disc.aSide.favorite}
                          className="absolute top-2 right-2 z-10"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </>
        )}
      </div>

      {/* Fixed Bottom Player */}
      <VinylPlayer />
    </div>
  );
};
