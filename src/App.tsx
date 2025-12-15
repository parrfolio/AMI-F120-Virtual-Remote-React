import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuthListener } from "@/hooks/useAuthListener";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useAuthStore } from "@/stores/authStore";
import { usePlayerStore } from "@/stores/playerStore";
import { Loading } from "@/components/Loading";
import { Login } from "@/components/Login";
import { Home } from "@/components/Home";
import { Songs } from "@/components/Songs";
import { SongManager } from "@/components/SongManager";
import { Lights } from "@/components/Lights";
import { About } from "@/components/About";
import { PulseSettings } from "@/components/PulseSettings";
import { useEffect, useRef } from "react";

function App() {
  useAuthListener();
  useSocketConnection(); // Initialize socket globally
  const { authed, loading } = useAuthStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Global timer effect - runs once on mount and never stops
  // Checks state every second but doesn't depend on React re-renders
  useEffect(() => {
    // Start persistent interval that runs continuously
    timerRef.current = setInterval(() => {
      const state = usePlayerStore.getState();

      // Only process if currently playing
      if (state.isPlaying && state.timeRemaining > 0) {
        state.decrementTime();
      } else if (
        state.timeRemaining === 0 &&
        state.currentIndex >= 0 &&
        state.queue.length > 0
      ) {
        // Song finished completely, mark as recently played in database
        const completedSong = state.queue[state.currentIndex];
        if (completedSong?.id) {
          state.markAsRecentlyPlayed(completedSong.id);
        }

        // Handle queue progression
        const nextIndex = state.currentIndex;
        state.removeFromQueue(nextIndex);

        // Play next song if available
        const updatedState = usePlayerStore.getState();
        if (updatedState.queue.length > nextIndex) {
          setTimeout(() => {
            const finalState = usePlayerStore.getState();
            const nextSong = finalState.playFromQueue(nextIndex);
            if (nextSong) {
              finalState.startTimer(nextSong.duration || 180);
            }
          }, 500);
        } else {
          // No more songs in queue, clear the player
          state.setIsPlaying(false);
          state.setNowPlaying(null);
          state.setIsPlayerExpanded(false);
        }
      }
    }, 1000);

    // Only cleanup on component unmount (app close)
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []); // Empty deps - run once on mount, cleanup on unmount

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Jukebox Controller - AMi F-120</title>
        <meta
          name="viewport"
          content="user-scalable=no,initial-scale=1.0,maximum-scale=1.0"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Helmet>

      <Routes>
        <Route
          path="/"
          element={authed ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/home"
          element={authed ? <Home /> : <Navigate to="/" replace />}
        />
        <Route
          path="/songs"
          element={authed ? <Songs /> : <Navigate to="/" replace />}
        />
        <Route
          path="/manage"
          element={authed ? <SongManager /> : <Navigate to="/" replace />}
        />
        <Route
          path="/pulsesettings"
          element={authed ? <PulseSettings /> : <Navigate to="/" replace />}
        />
        <Route
          path="/lights"
          element={authed ? <Lights /> : <Navigate to="/" replace />}
        />
        <Route
          path="/about"
          element={authed ? <About /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
