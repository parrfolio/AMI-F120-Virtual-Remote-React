import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Header } from "@/components/Header";
import { VinylPlayer } from "@/components/VinylPlayer";
import { AlbumArt } from "@/components/AlbumArt";
import { HeartButton } from "@/components/HeartButton";
import { usePlayerStore } from "@/stores/playerStore";
import { useJukeboxStore } from "@/stores/jukeboxStore";
import { Disc, Song } from "@/types";

export const Home = () => {
  const {
    socket,
    socketConnected,
    setSocket,
    setSocketConnected,
    setNowPlaying,
    setIsPlaying,
    setIsPlayerExpanded,
  } = usePlayerStore();

  const {
    jukeboxData,
    loading: jukeboxLoading,
    fetchSongs,
  } = useJukeboxStore();

  useEffect(() => {
    // Fetch jukebox data
    fetchSongs();
  }, [fetchSongs]);

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

    setNowPlaying({
      id: song.id,
      title: song.songTitle,
      artist: song.artist,
      albumCover: song.albumCover,
      favorite: song.favorite,
    });
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
        {jukeboxLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg font-metropolis text-gray-600">
              Loading songs...
            </p>
          </div>
        ) : (
          <>
            {/* In Queue Section */}
            <section className="mb-8">
              <h2 className="text-fluid-2xl font-bold font-metropolis-bold text-jukebox-black mb-4">
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
              <h2 className="text-fluid-2xl font-bold font-metropolis-bold text-jukebox-black mb-4">
                Recently Played
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {jukeboxData.slice(0, 3).map((disc, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-48 h-48 rounded-3xl overflow-hidden shadow-lg relative bg-black"
                  >
                    <AlbumArt
                      artist={disc.disc[0].artist}
                      album={disc.disc[0].songTitle}
                      localImage={disc.disc[0].albumCover}
                      discogsImage={disc.disc[0].albumArt}
                      alt={`${disc.disc[0].artist} album`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>

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

                        {/* Favorite Heart Toggle */}
                        <HeartButton
                          songId={song.id}
                          isFavorited={song.favorite}
                          className="absolute top-2 right-2"
                        />
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
