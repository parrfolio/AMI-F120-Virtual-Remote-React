import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TitleStrip } from "@/components/TitleStrip";
import { VinylPlayer } from "@/components/VinylPlayer";
import { useJukeboxStore } from "@/stores/jukeboxStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useLightsStore } from "@/stores/lightsStore";
import { animationThemes } from "@/data/animations.ts";
import { LAYOUT_CONFIG } from "@/config/layout";
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
    queue,
    addToQueue,
    playFromQueue,
    startTimer,
    nowPlaying,
  } = usePlayerStore();
  const { running: lightsRunning, animation } = useLightsStore();

  const sendPulseTrainToJukebox = (
    selection: SongSelection,
    callback?: () => void
  ) => {
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
            (response: SocketDirectionResponse) => {
              if (response.done) {
                // Turn lights back on after pulse train completes
                const lightDataOn: SocketLightsData = {
                  state: "on",
                  animation: animation,
                  stripConf: animationThemes[animation],
                };
                socket.emit("lights", lightDataOn, () => {
                  callback?.();
                });
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
            callback?.();
          }
        );
      }
    } else {
      console.log("Socket not connected - song will play locally only");
      callback?.();
    }
  };

  const handleSongSelect = (
    selection: SongSelection,
    song: Song,
    otherSide?: Song
  ) => {
    console.log("=== handleSongSelect called ===");
    console.log("Song:", song);
    console.log("Other side:", otherSide);
    console.log("Selection:", selection);

    // Check if song is already in queue
    const isAlreadyInQueue = queue.some(
      (queuedSong) => queuedSong.id === song.id
    );
    if (isAlreadyInQueue) {
      console.log("Song already in queue, skipping");
      return;
    }

    // Check if queue is empty BEFORE adding
    const isFirstSong = queue.length === 0;

    // Add to queue
    addToQueue({
      id: song.id,
      title: song.songTitle,
      artist: song.artist,
      albumCover: song.albumCover,
      albumArt: song.albumArt, // Discogs image
      favorite: song.favorite,
      selection: selection,
      duration: song.duration || 180, // Use song duration or default to 3 minutes
      side: song.side,
      otherSideTitle: otherSide?.songTitle,
      otherSideId: otherSide?.id,
      otherSideFavorite: otherSide?.favorite,
    });

    // Always send pulse train to jukebox to select the song in the stepper
    console.log("Sending pulse train for song selection:", selection.selection);
    sendPulseTrainToJukebox(selection);

    // If this is the first song in queue, start playing it immediately
    if (isFirstSong) {
      // Use setTimeout to ensure the queue state has fully updated
      setTimeout(() => {
        const firstSong = playFromQueue(0);
        if (firstSong) {
          console.log(
            "Starting timer with duration:",
            firstSong.duration || 180
          );
          startTimer(firstSong.duration || 180);
        }
      }, 100);
    }
  };

  // Always fetch fresh songs when this component mounts
  useEffect(() => {
    console.log("Songs component mounted - fetching songs");
    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount

  // Also refresh when component becomes visible (e.g., switching tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Page visible again - refreshing songs");
        fetchSongs();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchSongs]);

  // Debug: Log when jukebox data changes
  useEffect(() => {
    console.log("JukeboxData updated:", jukeboxData.length, "discs");
  }, [jukeboxData]);

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
      <div
        className={`container mx-auto px-4 sm:px-6 py-6 max-w-4xl ${LAYOUT_CONFIG.HEADER_CLEARANCE.SONGS} ${LAYOUT_CONFIG.PLAYER_CLEARANCE.SONGS} relative z-10`}
      >
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
                    {sectionDiscs.map((disc, discIndexInSection) => {
                      const isASidePlaying = nowPlaying?.id === disc.aSide.id;
                      const isBSidePlaying = nowPlaying?.id === disc.bSide?.id;
                      const highlightSide = isASidePlaying
                        ? "top"
                        : isBSidePlaying
                        ? "bottom"
                        : undefined;

                      // Calculate sequential display index (1-120)
                      const baseIndex =
                        sectionIndex * 10 + discIndexInSection * 2;
                      const displayIndexASide = baseIndex + 1;
                      const displayIndexBSide = baseIndex + 2;

                      return (
                        <div key={disc.discIndex} className="relative group">
                          <TitleStrip
                            title={disc.aSide.songTitle}
                            artist={disc.aSide.artist}
                            titleBottom={disc.bSide?.songTitle}
                            aSide={disc.aSide}
                            bSide={disc.bSide}
                            displayIndexASide={displayIndexASide}
                            displayIndexBSide={displayIndexBSide}
                            onSelectASide={(selection: SongSelection) =>
                              handleSongSelect(
                                selection,
                                disc.aSide,
                                disc.bSide
                              )
                            }
                            onSelectBSide={(selection: SongSelection) =>
                              handleSongSelect(
                                selection,
                                disc.bSide,
                                disc.aSide
                              )
                            }
                            clickable={true}
                            className="w-full max-w-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border-2 border-jukebox-red group-hover:shadow-[0_6px_20px_rgba(231,64,83,0.4)] transition-shadow"
                            highlightSide={highlightSide}
                          />
                        </div>
                      );
                    })}
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
