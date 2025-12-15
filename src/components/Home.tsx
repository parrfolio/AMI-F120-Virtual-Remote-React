import { useEffect } from "react";
import { Header } from "@/components/Header";
import { VinylPlayer } from "@/components/VinylPlayer";
import { AlbumArt } from "@/components/AlbumArt";
import { usePlayerStore } from "@/stores/playerStore";
import { LAYOUT_CONFIG } from "@/config/layout";
import { useJukeboxStore } from "@/stores/jukeboxStore";
import { useLightsStore } from "@/stores/lightsStore";
import { animationThemes } from "@/data/animations.ts";
import { formatTimeCompact } from "@/lib/timeUtils";
import vinylImage from "@/js/components/Assets/vinyl-parr.png";
import { SkipForward } from "lucide-react";
import {
  Disc,
  SongSelection,
  SocketLightsData,
  SocketDirectionResponse,
} from "@/types";

export const Home = () => {
  const {
    socket,
    socketConnected,
    setNowPlaying,
    setIsPlaying,
    setIsPlayerExpanded,
    queue,
    addToQueue,
    removeFromQueue,
    playFromQueue,
    currentIndex,
    timeRemaining,
    isPlaying,
    startTimer,
  } = usePlayerStore();

  const {
    jukeboxData,
    loading: jukeboxLoading,
    fetchSongs,
  } = useJukeboxStore();

  const { running: lightsRunning, animation } = useLightsStore();

  useEffect(() => {
    // Fetch jukebox data
    fetchSongs();
  }, [fetchSongs]);

  // Resume playback if there was a song playing before refresh
  useEffect(() => {
    if (
      currentIndex >= 0 &&
      queue.length > 0 &&
      timeRemaining > 0 &&
      !isPlaying
    ) {
      // Auto-resume playback after refresh
      setIsPlaying(true);
      setIsPlayerExpanded(true);
    }
  }, []); // Only run once on mount

  const sendPulseTrainToJukebox = (
    selection: SongSelection,
    callback?: () => void
  ) => {
    if (socket && socketConnected) {
      // If lights are running, turn them off before sending pulse train
      // This improves performance on Raspberry Pi
      if (lightsRunning && animation) {
        const lightData: SocketLightsData = {
          state: "off",
          animation: animation,
          stripConf: animationThemes[animation],
        };

        socket.emit("lights", lightData, (response: { running: boolean }) => {
          console.log("Lights turned off:", response);

          // Send pulse train to jukebox hardware
          socket.emit(
            "direction",
            selection,
            (response: SocketDirectionResponse) => {
              console.log("Pulse train complete:", response);

              // Turn lights back on after pulse train completes
              if (response.done) {
                const lightDataOn: SocketLightsData = {
                  state: "on",
                  animation: animation,
                  stripConf: animationThemes[animation],
                };

                socket.emit(
                  "lights",
                  lightDataOn,
                  (response: { running: boolean }) => {
                    console.log("Lights turned back on:", response);
                    callback?.();
                  }
                );
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

  const getTotalQueueDuration = () => {
    return queue.reduce((total, song) => total + (song.duration || 180), 0);
  };

  const handleQueueItemClick = (index: number) => {
    const song = playFromQueue(index);
    if (song) {
      startTimer(song.duration || 180);
      // Don't send pulse train - it was already sent when song was added to queue
    }
  };

  const handleSkipCurrent = () => {
    if (queue.length === 0) return;

    // If nothing is playing yet, start playing the first song
    if (currentIndex < 0) {
      const firstSong = playFromQueue(0);
      if (firstSong) {
        startTimer(firstSong.duration || 180);
      }
      return;
    }

    // Check if there are more songs after the current one BEFORE removing
    const hasMoreSongs = queue.length > currentIndex + 1;

    // Remove the currently playing song
    removeFromQueue(currentIndex);

    // If there are more songs in the queue after removal, play the next song
    if (hasMoreSongs) {
      // The next song is now at the same index position after removal
      setTimeout(() => {
        const nextSong = playFromQueue(currentIndex);
        if (nextSong) {
          startTimer(nextSong.duration || 180);
          // Don't send pulse train - it was already sent when song was added to queue
        }
      }, 100);
    } else {
      // No more songs in queue, stop playing and clear the player
      setIsPlaying(false);
      setNowPlaying(null);
      setIsPlayerExpanded(false);
    }
  };

  const handleSongSelect = (disc: Disc, songIndex: number) => {
    const song = disc.disc[songIndex];
    console.log("Adding song to queue:", song);

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

    // Get the other side of the disc if it exists
    const otherSide = disc.disc.find((s) => s.id !== song.id);

    // Add to queue
    addToQueue({
      id: song.id,
      title: song.songTitle,
      artist: song.artist,
      albumCover: song.albumCover,
      albumArt: song.albumArt, // Discogs image
      favorite: song.favorite,
      selection: song.select,
      duration: song.duration || 180, // Use song duration or default to 3 minutes
      side: song.side,
      otherSideTitle: otherSide?.songTitle,
      otherSideId: otherSide?.id,
      otherSideFavorite: otherSide?.favorite,
    });

    // Always send pulse train to jukebox to select the song in the stepper
    console.log(
      "Sending pulse train for song selection:",
      song.select.selection
    );
    sendPulseTrainToJukebox(song.select);

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
          // Force set playing state to true
          setIsPlaying(true);
        }
      }, 100);
    }
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
        className={`container mx-auto px-4 sm:px-6 py-6 max-w-7xl ${LAYOUT_CONFIG.HEADER_CLEARANCE.HOME} ${LAYOUT_CONFIG.PLAYER_CLEARANCE.HOME} relative z-10`}
      >
        {jukeboxLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg font-metropolis text-gray-600">
              Loading songs...
            </p>
          </div>
        ) : (
          <>
            {/* In Queue Section */}
            {queue.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-fluid-2xl font-bold font-metropolis-bold text-jukebox-black">
                    In Queue ({queue.length}){" "}
                    {formatTimeCompact(getTotalQueueDuration())}
                  </h2>
                  <button
                    onClick={handleSkipCurrent}
                    disabled={queue.length === 0}
                    className="flex items-center gap-2 bg-jukebox-red text-white py-2 px-4 rounded-xl font-metropolis-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Skip to next song in queue"
                  >
                    <SkipForward className="h-5 w-5" />
                    <span className="hidden md:inline">Skip</span>
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {queue.map((song, index) => {
                    const isCurrentlyPlaying = index === currentIndex;
                    const showTimer = isCurrentlyPlaying && isPlaying;

                    return (
                      <div
                        key={`${song.id}-${index}`}
                        className={`flex-shrink-0 rounded-3xl p-4 w-80 flex items-center gap-4 cursor-pointer group relative ${
                          isCurrentlyPlaying
                            ? "bg-jukebox-red ring-2 ring-white"
                            : "bg-jukebox-red"
                        }`}
                        onClick={() => handleQueueItemClick(index)}
                      >
                        {isCurrentlyPlaying && isPlaying ? (
                          <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 relative">
                            <img
                              src={vinylImage}
                              alt="Now Playing"
                              className="w-full h-full animate-spin-slow"
                            />
                          </div>
                        ) : song.albumArt || song.albumCover ? (
                          <img
                            src={song.albumArt || song.albumCover}
                            alt={song.title}
                            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center flex-shrink-0 relative">
                            <div className="w-6 h-6 bg-white rounded-full"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 bg-jukebox-red rounded-full"></div>
                            </div>
                          </div>
                        )}
                        <div className="text-white min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-metropolis-bold text-fluid-lg truncate">
                              {song.artist}
                            </p>
                            {showTimer && (
                              <p className="font-metropolis-bold text-lg whitespace-nowrap">
                                {formatTimeCompact(timeRemaining)}
                              </p>
                            )}
                          </div>
                          <p className="font-metropolis text-fluid-sm truncate">
                            {song.title}
                          </p>
                        </div>
                        {!isCurrentlyPlaying && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromQueue(index);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-gray-200 text-xl font-bold"
                            aria-label="Remove from queue"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Recently Played Section */}
            {jukeboxData
              .flatMap((disc) => disc.disc)
              .filter((song) => song.recentlyPlayed === true).length > 0 && (
              <section className="mb-8">
                <h2 className="text-fluid-2xl font-bold font-metropolis-bold text-jukebox-black mb-4">
                  Recently Played
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {jukeboxData.flatMap((disc, discIndex) =>
                    disc.disc
                      .filter((song) => song.recentlyPlayed === true)
                      .map((song, songIndex) => (
                        <div
                          key={`${song.id || `${discIndex}-${songIndex}`}`}
                          className="flex-shrink-0 w-48 h-48 rounded-3xl overflow-hidden shadow-lg relative bg-black group"
                        >
                          <AlbumArt
                            artist={song.artist}
                            album={song.songTitle}
                            localImage={song.albumCover}
                            discogsImage={song.albumArt}
                            alt={`${song.artist} - ${song.songTitle}`}
                            className="w-full h-full object-cover"
                            songId={song.id}
                            isFavorited={song.favorite}
                            showHeart={true}
                          />
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (song.id) {
                                // Update UI immediately using jukeboxStore
                                const { useJukeboxStore } = await import(
                                  "@/stores/jukeboxStore"
                                );
                                useJukeboxStore
                                  .getState()
                                  .updateSongRecentlyPlayed(song.id, false);

                                // Then update database
                                const { updateRecentlyPlayed } = await import(
                                  "@/lib/firebase"
                                );
                                await updateRecentlyPlayed(song.id, false);
                              }
                            }}
                            className="absolute top-2 left-2 z-10 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                            aria-label="Remove from recently played"
                          >
                            ×
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </section>
            )}

            {/* Songs/Favorites Section */}
            <section>
              <h2 className="text-fluid-2xl font-bold font-metropolis-bold text-jukebox-black mb-4">
                Favorites
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {jukeboxData.flatMap((disc, discIndex) =>
                  disc.disc
                    .filter((song) => song.favorite === true)
                    .map((song, songIndex) => (
                      <div
                        key={`${song.id || `${discIndex}-${songIndex}`}`}
                        className="group relative aspect-square overflow-hidden rounded-3xl bg-black shadow-lg transition-all duration-300 hover:scale-105 animate-in fade-in zoom-in"
                        style={{
                          animationDuration: "300ms",
                        }}
                      >
                        <button
                          onClick={() => handleSongSelect(disc, songIndex)}
                          className="w-full h-full"
                        >
                          <AlbumArt
                            artist={song.artist}
                            album={song.songTitle}
                            localImage={song.albumCover}
                            discogsImage={song.albumArt}
                            alt={song.songTitle}
                            className="h-full w-full object-cover"
                            songId={song.id}
                            isFavorited={song.favorite}
                            showHeart={true}
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
                      </div>
                    ))
                )}
              </div>
              {jukeboxData
                .flatMap((disc) => disc.disc)
                .filter((song) => song.favorite === true).length === 0 && (
                <p className="text-gray-500 font-metropolis text-center py-8">
                  No favorites yet. Add songs to favorites from the Songs page.
                </p>
              )}
            </section>
          </>
        )}
      </div>

      {/* Vinyl Player at Bottom */}
      <VinylPlayer />
    </div>
  );
};
