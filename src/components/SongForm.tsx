import { useState, useEffect } from "react";
import { Song } from "@/types";
import { calculatePulseTrains } from "@/lib/pulseTrain";
import { formatDuration, parseDuration, getTrackDuration } from "@/lib/lastfm";

interface SongFormProps {
  initialSong?: Song;
  prePopulatedData?: Partial<Song>; // For Discogs pre-population
  onSubmit: (song: Song) => void;
  onCancel: () => void;
}

export const SongForm = ({
  initialSong,
  prePopulatedData,
  onSubmit,
  onCancel,
}: SongFormProps) => {
  const [songTitle, setSongTitle] = useState(
    initialSong?.songTitle || prePopulatedData?.songTitle || ""
  );
  const [side, setSide] = useState<"A Side" | "B Side">(
    initialSong?.side || prePopulatedData?.side || "A Side"
  );
  const [artist, setArtist] = useState(
    initialSong?.artist || prePopulatedData?.artist || ""
  );
  const [albumArt, setAlbumArt] = useState(
    initialSong?.albumArt || prePopulatedData?.albumArt || ""
  );
  const [state, setState] = useState<"on" | "off">(
    initialSong?.select.state || "on"
  );
  const [selection, setSelection] = useState(
    initialSong?.select.selection || 1
  );
  const [ptrainDelay, setPtrainDelay] = useState(
    initialSong?.select.ptrainDelay || 400
  );
  const [duration, setDuration] = useState(
    initialSong?.duration || prePopulatedData?.duration || 180
  );
  const [durationInput, setDurationInput] = useState(
    formatDuration(initialSong?.duration || prePopulatedData?.duration || 180)
  );
  const [fetchingDuration, setFetchingDuration] = useState(false);

  useEffect(() => {
    if (initialSong) {
      setSongTitle(initialSong.songTitle);
      setSide(initialSong.side);
      setArtist(initialSong.artist);
      setAlbumArt(initialSong.albumArt || "");
      setState(initialSong.select.state);
      setSelection(initialSong.select.selection);
      setPtrainDelay(initialSong.select.ptrainDelay);
      if (initialSong.duration) {
        setDuration(initialSong.duration);
        setDurationInput(formatDuration(initialSong.duration));
      }
    } else if (prePopulatedData) {
      // Pre-populate from Discogs
      if (prePopulatedData.songTitle) setSongTitle(prePopulatedData.songTitle);
      if (prePopulatedData.side) setSide(prePopulatedData.side);
      if (prePopulatedData.artist) setArtist(prePopulatedData.artist);
      if (prePopulatedData.albumArt) setAlbumArt(prePopulatedData.albumArt);
      if (prePopulatedData.duration) {
        setDuration(prePopulatedData.duration);
        setDurationInput(formatDuration(prePopulatedData.duration));
      }
    }
  }, [initialSong, prePopulatedData]);

  const handleDurationChange = (value: string) => {
    setDurationInput(value);
    const seconds = parseDuration(value);
    if (seconds > 0) {
      setDuration(seconds);
    }
  };

  const handleFetchDuration = async () => {
    if (!artist || !songTitle) {
      return;
    }

    setFetchingDuration(true);
    try {
      const fetchedDuration = await getTrackDuration(artist, songTitle);
      if (fetchedDuration) {
        setDuration(fetchedDuration);
        setDurationInput(formatDuration(fetchedDuration));
      }
    } catch (error) {
      console.error("Failed to fetch duration from Last.fm:", error);
    } finally {
      setFetchingDuration(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate pulse trains based on selection number (1-120)
    const ptrains = calculatePulseTrains(selection);

    const song: Song = {
      id: initialSong?.id,
      songTitle,
      side,
      artist,
      albumArt: albumArt || undefined, // Include Discogs album art if available
      favorite: initialSong?.favorite || false, // Preserve favorite status
      duration, // Include duration
      select: {
        state,
        selection,
        ptrains,
        ptrainDelay,
      },
    };

    onSubmit(song);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-lg p-6 space-y-4"
    >
      <div className="flex items-start gap-6 mb-4">
        {/* Album Art Preview */}
        {albumArt && (
          <div className="flex-shrink-0">
            <img
              src={albumArt}
              alt="Album art"
              className="w-32 h-32 rounded-xl object-cover shadow-lg border-2 border-jukebox-red"
            />
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-2xl font-metropolis-bold text-jukebox-black">
            {initialSong ? "Edit Song" : "Add New Song"}
          </h3>
          {albumArt && (
            <p className="text-sm text-gray-500 font-metropolis mt-1">
              From Discogs Collection
            </p>
          )}
        </div>
      </div>

      {/* Song Title */}
      <div>
        <label
          htmlFor="songTitle"
          className="block text-sm font-metropolis-bold text-jukebox-black mb-2"
        >
          Song Title *
        </label>
        <input
          type="text"
          id="songTitle"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-jukebox-red focus:outline-none font-metropolis"
          placeholder="Enter song title"
        />
      </div>

      {/* Artist */}
      <div>
        <label
          htmlFor="artist"
          className="block text-sm font-metropolis-bold text-jukebox-black mb-2"
        >
          Artist *
        </label>
        <input
          type="text"
          id="artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-jukebox-red focus:outline-none font-metropolis"
          placeholder="Enter artist name"
        />
      </div>

      {/* Duration */}
      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-metropolis-bold text-jukebox-black mb-2"
        >
          Duration (MM:SS)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            id="duration"
            value={durationInput}
            onChange={(e) => handleDurationChange(e.target.value)}
            className="w-24 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-jukebox-red focus:outline-none font-metropolis text-center"
            placeholder="3:00"
            pattern="[0-9]{1,2}:[0-5][0-9]"
          />
          <button
            type="button"
            onClick={handleFetchDuration}
            disabled={!artist || !songTitle || fetchingDuration}
            className="px-4 py-2 bg-gray-200 text-jukebox-black rounded-xl font-metropolis-bold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fetchingDuration ? "Fetching..." : "Fetch from Last.fm"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1 font-metropolis">
          Default: 3:00. Auto-fetched from Discogs when available.
        </p>
      </div>

      {/* Side (Read-only display) */}
      <div>
        <label className="block text-sm font-metropolis-bold text-jukebox-black mb-2">
          Side
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="side"
              value="A Side"
              checked={side === "A Side"}
              onChange={(e) => setSide(e.target.value as "A Side")}
              className="mr-2"
            />
            <span className="font-metropolis">A Side</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="side"
              value="B Side"
              checked={side === "B Side"}
              onChange={(e) => setSide(e.target.value as "B Side")}
              className="mr-2"
            />
            <span className="font-metropolis">B Side</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1 font-metropolis">
          Pulse trains are calculated automatically based on selection number
        </p>
      </div>

      {/* Selection (1-120) */}
      <div>
        <label
          htmlFor="selection"
          className="block text-sm font-metropolis-bold text-jukebox-black mb-2"
        >
          Selection Number (1-120) *
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            id="selectionRange"
            min="1"
            max="120"
            value={selection}
            onChange={(e) => setSelection(Number(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            id="selection"
            min="1"
            max="120"
            value={selection}
            onChange={(e) => setSelection(Number(e.target.value))}
            required
            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-xl focus:border-jukebox-red focus:outline-none font-metropolis text-center"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 font-metropolis">
          Pulse trains for selection {selection}: [
          {calculatePulseTrains(selection).join(", ")}]
        </p>
      </div>

      {/* State */}
      <div>
        <label
          htmlFor="state"
          className="block text-sm font-metropolis-bold text-jukebox-black mb-2"
        >
          State
        </label>
        <select
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value as "on" | "off")}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-jukebox-red focus:outline-none font-metropolis"
        >
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </div>

      {/* Pulse Train Delay */}
      <div>
        <label
          htmlFor="ptrainDelay"
          className="block text-sm font-metropolis-bold text-jukebox-black mb-2"
        >
          Pulse Train Delay (100-1500ms)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            id="ptrainDelayRange"
            min="100"
            max="1500"
            step="50"
            value={ptrainDelay}
            onChange={(e) => setPtrainDelay(Number(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            id="ptrainDelay"
            min="100"
            max="1500"
            value={ptrainDelay}
            onChange={(e) => setPtrainDelay(Number(e.target.value))}
            className="w-24 px-3 py-2 border-2 border-gray-300 rounded-xl focus:border-jukebox-red focus:outline-none font-metropolis text-center"
          />
          <span className="text-sm font-metropolis text-gray-600">ms</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 font-metropolis">
          Default: 400ms
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-jukebox-red text-white py-3 px-6 rounded-xl font-metropolis-bold hover:bg-[#b73145] transition-colors"
        >
          {initialSong ? "Update Song" : "Add Song"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-jukebox-black py-3 px-6 rounded-xl font-metropolis-bold hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
