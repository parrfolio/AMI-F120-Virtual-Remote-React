import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { useJukeboxStore } from "@/stores/jukeboxStore";
import { toggleFavorite } from "@/lib/firebase";

interface HeartButtonProps {
  songId?: string;
  isFavorited?: boolean;
  className?: string;
}

export const HeartButton = ({
  songId,
  isFavorited,
  className = "",
}: HeartButtonProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [activeHeart, setActiveHeart] = useState(false);
  const { updateSongFavorite } = useJukeboxStore();

  useEffect(() => {
    // Connect to socket for real-time updates
    const newSocket = io({
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setSocketConnected(true);
    });

    newSocket.on("disconnect", () => {
      setSocketConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
      setSocketConnected(false);
    });

    // Listen for favorite changes from other clients
    newSocket.on(
      "favorite-changed",
      (data: { songId: string; favorite: boolean }) => {
        updateSongFavorite(data.songId, data.favorite);
      }
    );

    return () => {
      newSocket.close();
    };
  }, [updateSongFavorite]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!songId) {
      console.log("No song ID provided");
      return;
    }

    const currentFavorite = isFavorited || false;
    const newFavorite = !currentFavorite;

    console.log("Toggling favorite:", { songId, currentFavorite, newFavorite });

    // Trigger sprite animation
    setActiveHeart(true);
    setTimeout(() => {
      setActiveHeart(false);
    }, 1000);

    // Optimistically update UI immediately
    updateSongFavorite(songId, newFavorite);

    // Emit websocket event to other clients
    if (socket && socketConnected) {
      socket.emit("favorite-update", {
        songId: songId,
        favorite: newFavorite,
      });
    }

    // Update in Firebase in background
    try {
      await toggleFavorite(songId, currentFavorite);
    } catch (err) {
      // Revert on error
      updateSongFavorite(songId, currentFavorite);
      console.error("Failed to toggle favorite:", err);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`z-10 ${className}`}
      aria-label="Toggle favorite"
    >
      <div
        className={`heart-button ${activeHeart ? "is-active" : ""} ${
          isFavorited ? "is-favorited" : ""
        }`}
      />
    </button>
  );
};
