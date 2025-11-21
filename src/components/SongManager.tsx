import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SongForm } from "@/components/SongForm";
import { DiscogsRecordPicker } from "@/components/DiscogsRecordPicker";
import { AlbumArt } from "@/components/AlbumArt";
import {
  getAllSongs,
  saveSong,
  deleteSong,
  saveDisc,
  getAllDiscs,
  deleteDisc,
} from "@/lib/firebase";
import { useJukeboxStore } from "@/stores/jukeboxStore";
import { Song } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  Music,
  Grid3x3,
  List,
  Disc3,
  X,
  GripVertical,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export const SongManager = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | undefined>(undefined);
  const [prePopulatedData, setPrePopulatedData] = useState<
    Partial<Song> | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showDiscogsPicker, setShowDiscogsPicker] = useState(false);
  const [draggedDiscIndex, setDraggedDiscIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [stagedSongs, setStagedSongs] = useState<Song[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { refreshSongs } = useJukeboxStore();

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      const fetchedSongs = await getAllSongs();
      setSongs(fetchedSongs);
      setError(null);
    } catch (err) {
      setError("Failed to load songs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSong = () => {
    setEditingSong(undefined);
    setPrePopulatedData(undefined);
    setShowForm(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setPrePopulatedData(undefined);
    setShowForm(true);
  };

  const handleDiscogsSelect = async (discSongs: {
    aSide: Partial<Song>;
    bSide: Partial<Song>;
  }) => {
    // Check if adding 2 more songs would exceed the limit
    if (songs.length + 2 > 120) {
      setError(
        `Cannot add songs. You have ${songs.length} songs and the limit is 120.`
      );
      return;
    }

    // Get the next available selection numbers
    const maxSelection =
      songs.length > 0 ? Math.max(...songs.map((s) => s.select.selection)) : 0;

    const aSideSelection = maxSelection + 1;
    const bSideSelection = maxSelection + 2;

    // Create A Side song
    const aSideSong: Song = {
      songTitle: discSongs.aSide.songTitle || "",
      side: "A Side",
      artist: discSongs.aSide.artist || "",
      albumArt: discSongs.aSide.albumArt,
      favorite: false,
      select: {
        state: "on",
        selection: aSideSelection,
        ptrains: [2, 1],
        ptrainDelay: 400,
      },
    };

    // Create B Side song
    const bSideSong: Song = {
      songTitle: discSongs.bSide.songTitle || "",
      side: "B Side",
      artist: discSongs.bSide.artist || "",
      albumArt: discSongs.bSide.albumArt,
      favorite: false,
      select: {
        state: "on",
        selection: bSideSelection,
        ptrains: [2, 2],
        ptrainDelay: 400,
      },
    };

    try {
      // Optimistically update UI first to prevent flashing
      setSongs((prev) => [...prev, aSideSong, bSideSong]);

      // Save as a single disc document with both sides
      await saveDisc({
        disc: [aSideSong, bSideSong],
      });

      // Refresh in background without reloading component
      await refreshSongs();
      setError(null);
    } catch (err) {
      // On error, reload to get correct state
      await loadSongs();
      setError("Failed to add songs from Discogs");
      console.error(err);
    }
  };

  const handleRemoveFromDiscogs = async (albumArt: string) => {
    // Find songs with this album art
    const songsToDelete = songs.filter((s) => s.albumArt === albumArt);

    if (songsToDelete.length === 0) return;

    const confirmMsg = `Remove "${songsToDelete[0].artist}" (${
      songsToDelete.length
    } song${songsToDelete.length > 1 ? "s" : ""}) from jukebox?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      for (const song of songsToDelete) {
        if (song.id) {
          await deleteSong(song.id);
        }
      }
      await loadSongs();
      await refreshSongs();
      setError(null);
    } catch (err) {
      setError("Failed to remove songs from jukebox");
      console.error(err);
    }
  };

  const handleDeleteSong = async (song: Song) => {
    if (
      !song.id ||
      !window.confirm(
        `Are you sure you want to delete "${song.songTitle}" by ${song.artist}?`
      )
    ) {
      return;
    }

    try {
      await deleteSong(song.id);
      await loadSongs();
      await refreshSongs();
    } catch (err) {
      setError("Failed to delete song");
      console.error(err);
    }
  };

  const handleDeleteDisc = async (disc: Song[]) => {
    const aSide = disc.find((s) => s.side === "A Side") || disc[0];

    if (
      !window.confirm(
        `Are you sure you want to delete the entire disc "${aSide.artist}"?`
      )
    ) {
      return;
    }

    try {
      // Get disc ID from the song ID (format: "disc-1-a" -> "disc-1")
      if (aSide.id) {
        const parts = aSide.id.split("-");
        if (parts.length >= 2) {
          const discId = `${parts[0]}-${parts[1]}`;
          await deleteDisc(discId);
          await loadSongs();
          await refreshSongs();
        }
      }
    } catch (err) {
      setError("Failed to delete disc");
      console.error(err);
    }
  };

  const handleSubmitSong = async (song: Song) => {
    try {
      if (editingSong) {
        // Update existing song - preserve id and selection number
        await saveSong({
          ...song,
          id: editingSong.id,
          select: {
            ...song.select,
            selection: editingSong.select.selection,
          },
        });
      } else {
        // New song - assign next available selection number
        const maxSelection =
          songs.length > 0
            ? Math.max(...songs.map((s) => s.select.selection))
            : 0;

        await saveSong({
          ...song,
          select: {
            ...song.select,
            selection: maxSelection + 1,
          },
        });
      }

      setShowForm(false);
      setEditingSong(undefined);
      setPrePopulatedData(undefined);
      await loadSongs();
      await refreshSongs();
    } catch (err) {
      setError("Failed to save song");
      console.error(err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSong(undefined);
    setPrePopulatedData(undefined);
  };

  // Group songs into disc pairs (A/B sides) for display
  const groupSongsIntoDiscs = (
    songsToGroup: Song[] = displaySongs
  ): Song[][] => {
    const sorted = [...songsToGroup].sort(
      (a, b) => a.select.selection - b.select.selection
    );
    const discs: Song[][] = [];
    const used = new Set<string>();

    for (const song of sorted) {
      if (used.has(song.id || "")) continue;

      // Try to find matching B-side by albumArt
      if (song.albumArt) {
        const pair = sorted.filter(
          (s) => s.albumArt === song.albumArt && !used.has(s.id || "")
        );
        if (pair.length >= 2) {
          const aSide = pair.find((s) => s.side === "A Side");
          const bSide = pair.find((s) => s.side === "B Side");
          if (aSide && bSide) {
            discs.push([aSide, bSide]);
            used.add(aSide.id || "");
            used.add(bSide.id || "");
            continue;
          }
        }
      }

      // Try to find consecutive A/B pair with same artist
      const nextSong = sorted.find(
        (s) =>
          !used.has(s.id || "") &&
          s.artist === song.artist &&
          s.select.selection === song.select.selection + 1
      );

      if (
        nextSong &&
        song.side === "A Side" &&
        nextSong.side === "B Side" &&
        song.artist === nextSong.artist
      ) {
        discs.push([song, nextSong]);
        used.add(song.id || "");
        used.add(nextSong.id || "");
      } else {
        // Add as single
        discs.push([song]);
        used.add(song.id || "");
      }
    }

    return discs;
  };

  const handleDragStart = (e: React.DragEvent, discIndex: number) => {
    setDraggedDiscIndex(discIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, discIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedDiscIndex !== null && draggedDiscIndex !== discIndex) {
      setDragOverIndex(discIndex);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDiscIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedDiscIndex === null || draggedDiscIndex === targetDiscIndex) {
      setDraggedDiscIndex(null);
      return;
    }

    const discs = groupSongsIntoDiscs();
    const reordered = [...discs];
    const [draggedDisc] = reordered.splice(draggedDiscIndex, 1);
    reordered.splice(targetDiscIndex, 0, draggedDisc);

    // Update selection numbers based on new order
    const updatedSongs: Song[] = [];
    let selectionNumber = 1;

    for (const disc of reordered) {
      for (const song of disc) {
        updatedSongs.push({
          ...song,
          select: {
            ...song.select,
            selection: selectionNumber++,
          },
        });
      }
    }

    // Stage the changes instead of saving immediately
    setStagedSongs(updatedSongs);
    setDraggedDiscIndex(null);
  };

  const handleSaveOrder = async () => {
    if (!stagedSongs) return;

    setIsSaving(true);
    try {
      // Save all updated songs
      for (const song of stagedSongs) {
        await saveSong(song);
      }
      await loadSongs();
      await refreshSongs();
      setStagedSongs(null);
      setError(null);
      setIsSaving(false);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      setError("Failed to save song order");
      console.error(err);
      setIsSaving(false);
    }
  };

  const handleCancelOrder = () => {
    setStagedSongs(null);
  };

  const handlePositionChange = (discIndex: number, newPosition: number) => {
    const discs = groupSongsIntoDiscs();
    const reordered = [...discs];
    const [movedDisc] = reordered.splice(discIndex, 1);
    reordered.splice(newPosition, 0, movedDisc);

    // Update selection numbers based on new order
    const updatedSongs: Song[] = [];
    let selectionNumber = 1;

    for (const disc of reordered) {
      for (const song of disc) {
        updatedSongs.push({
          ...song,
          select: {
            ...song.select,
            selection: selectionNumber++,
          },
        });
      }
    }

    // Stage the changes
    setStagedSongs(updatedSongs);
  };

  // Use staged songs for display if available, otherwise use songs
  const displaySongs = stagedSongs || songs;

  const totalSongs = displaySongs.length;
  const maxSongs = 120;

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

      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-6xl relative z-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-metropolis-bold text-jukebox-black mb-2">
              Song Manager
            </h1>
            <p className="text-lg font-metropolis text-gray-600">
              {totalSongs} of {maxSongs} songs
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-jukebox-red shadow-sm"
                    : "text-gray-600 hover:text-jukebox-black"
                }`}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-jukebox-red shadow-sm"
                    : "text-gray-600 hover:text-jukebox-black"
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={handleAddSong}
              disabled={totalSongs >= maxSongs}
              className="flex items-center gap-2 bg-white text-jukebox-red border-2 border-jukebox-red py-3 px-6 rounded-xl font-metropolis-bold hover:bg-jukebox-red hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              Add Single
            </button>
            <button
              onClick={() => setShowDiscogsPicker(!showDiscogsPicker)}
              className="flex items-center gap-2 bg-jukebox-red text-white py-3 px-6 rounded-xl font-metropolis-bold hover:bg-[#b73145] transition-colors"
            >
              {showDiscogsPicker ? (
                <>
                  <X className="h-5 w-5" />
                  Close Collection
                </>
              ) : (
                <>
                  <Disc3 className="h-5 w-5" />
                  My Collection
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 font-metropolis">
            {error}
          </div>
        )}

        {/* Discogs Record Picker */}
        {showDiscogsPicker && (
          <>
            {songs.length >= 118 && songs.length < 120 && (
              <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-3 rounded-xl mb-4 font-metropolis">
                <p className="font-metropolis-bold">
                  ⚠️ Near capacity: {songs.length} of 120 songs
                </p>
                <p className="text-sm">
                  You can only add {Math.floor((120 - songs.length) / 2)} more
                  disc(s).
                </p>
              </div>
            )}
            {songs.length >= 120 && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 font-metropolis">
                <p className="font-metropolis-bold">
                  🚫 Capacity reached: 120 of 120 songs
                </p>
                <p className="text-sm">
                  You cannot add more songs. Please remove some songs first.
                </p>
              </div>
            )}
            <DiscogsRecordPicker
              username="ryanparr"
              existingSongs={songs}
              onSelectRecord={handleDiscogsSelect}
              onRemoveRecord={handleRemoveFromDiscogs}
              maxSongs={120}
            />
          </>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="mb-8">
            <SongForm
              initialSong={editingSong}
              prePopulatedData={prePopulatedData}
              onSubmit={handleSubmitSong}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Songs List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Music className="h-12 w-12 text-jukebox-red animate-pulse mx-auto mb-4" />
              <p className="text-lg font-metropolis text-gray-600">
                Loading songs...
              </p>
            </div>
          </div>
        ) : displaySongs.length === 0 ? (
          <div className="text-center py-20">
            <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-metropolis-bold text-gray-600 mb-2">
              No songs yet
            </p>
            <p className="text-gray-500 font-metropolis">
              Click "Add Song" or "My Collection" to get started
            </p>
          </div>
        ) : viewMode === "list" ? (
          /* List View - Discogs Style with Drag & Drop */
          <div className="space-y-2">
            {groupSongsIntoDiscs().map((disc, discIndex) => {
              const isDiscPair = disc.length === 2;
              const aSide = disc[0];
              const bSide = disc.length === 2 ? disc[1] : null;

              return (
                <div key={`disc-${discIndex}`} className="relative">
                  {/* Drop Indicator Line */}
                  {dragOverIndex === discIndex &&
                    draggedDiscIndex !== discIndex && (
                      <div className="absolute -top-1 left-0 right-0 h-0.5 bg-jukebox-red z-10">
                        <div className="absolute -left-1 -top-1 w-2 h-2 bg-jukebox-red rounded-full"></div>
                        <div className="absolute -right-1 -top-1 w-2 h-2 bg-jukebox-red rounded-full"></div>
                      </div>
                    )}

                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, discIndex)}
                    onDragOver={(e) => handleDragOver(e, discIndex)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, discIndex)}
                    className={`bg-white rounded-lg shadow hover:shadow-md transition-all cursor-move ${
                      draggedDiscIndex === discIndex ? "opacity-50" : ""
                    }`}
                  >
                    {/* Disc Header (only for pairs) */}
                    {isDiscPair && (
                      <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-1 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-gray-400" />
                          <Disc3 className="h-4 w-4 text-jukebox-red" />
                          <span className="text-sm font-metropolis-bold text-gray-700">
                            {aSide.artist}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={discIndex}
                            onChange={(e) => {
                              e.stopPropagation();
                              handlePositionChange(
                                discIndex,
                                parseInt(e.target.value)
                              );
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1 text-xs font-metropolis-bold border border-gray-300 rounded-lg hover:border-jukebox-red focus:border-jukebox-red focus:outline-none focus:ring-2 focus:ring-jukebox-red/20 cursor-pointer"
                          >
                            {groupSongsIntoDiscs().map((_, idx) => (
                              <option key={idx} value={idx}>
                                Position {idx + 1}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDisc(disc);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete entire disc"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* A-Side */}
                    <div className="p-4 flex items-center gap-4">
                      {/* Drag Handle (for singles) */}
                      {!isDiscPair && (
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <select
                            value={discIndex}
                            onChange={(e) => {
                              e.stopPropagation();
                              handlePositionChange(
                                discIndex,
                                parseInt(e.target.value)
                              );
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 text-xs font-metropolis-bold border border-gray-300 rounded-lg hover:border-jukebox-red focus:border-jukebox-red focus:outline-none focus:ring-2 focus:ring-jukebox-red/20 cursor-pointer"
                          >
                            {groupSongsIntoDiscs().map((_, idx) => (
                              <option key={idx} value={idx}>
                                #{idx + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Album Art */}
                      <div className="flex-shrink-0 w-16 h-16">
                        <AlbumArt
                          artist={aSide.artist}
                          album={aSide.songTitle}
                          discogsImage={aSide.albumArt}
                          alt={aSide.songTitle}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block bg-jukebox-red text-white px-2 py-0.5 rounded text-xs font-metropolis-bold">
                            #{aSide.select.selection}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-metropolis-bold ${
                              aSide.select.state === "on"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {aSide.select.state.toUpperCase()}
                          </span>
                          <span className="text-xs font-metropolis text-gray-500">
                            {aSide.side}
                          </span>
                        </div>
                        <h3 className="font-metropolis-bold text-base text-jukebox-black truncate">
                          {aSide.songTitle}
                        </h3>
                        <p className="text-sm text-gray-600 font-metropolis truncate">
                          {aSide.artist}
                        </p>
                      </div>

                      {/* Technical Info */}
                      <div className="hidden md:flex items-center gap-4 text-xs font-metropolis text-gray-500">
                        <span>Trains: [{aSide.select.ptrains.join(", ")}]</span>
                        <span>Delay: {aSide.select.ptrainDelay}ms</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditSong(aSide)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          aria-label="Edit song"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {!isDiscPair && (
                          <button
                            onClick={() => handleDeleteSong(aSide)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete song"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* B-Side (if pair) */}
                    {bSide && (
                      <div className="px-4 pb-4 flex items-center gap-4 border-t border-gray-100 pt-4">
                        {/* Album Art */}
                        <div className="flex-shrink-0 w-16 h-16">
                          <AlbumArt
                            artist={bSide.artist}
                            album={bSide.songTitle}
                            discogsImage={bSide.albumArt}
                            alt={bSide.songTitle}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>

                        {/* Song Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block bg-jukebox-red text-white px-2 py-0.5 rounded text-xs font-metropolis-bold">
                              #{bSide.select.selection}
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-metropolis-bold ${
                                bSide.select.state === "on"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {bSide.select.state.toUpperCase()}
                            </span>
                            <span className="text-xs font-metropolis text-gray-500">
                              {bSide.side}
                            </span>
                          </div>
                          <h3 className="font-metropolis-bold text-base text-jukebox-black truncate">
                            {bSide.songTitle}
                          </h3>
                          <p className="text-sm text-gray-600 font-metropolis truncate">
                            {bSide.artist}
                          </p>
                        </div>

                        {/* Technical Info */}
                        <div className="hidden md:flex items-center gap-4 text-xs font-metropolis text-gray-500">
                          <span>
                            Trains: [{bSide.select.ptrains.join(", ")}]
                          </span>
                          <span>Delay: {bSide.select.ptrainDelay}ms</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditSong(bSide)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="Edit song"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displaySongs.map((song) => (
              <div
                key={song.id}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  {/* Album Art */}
                  <div className="flex-shrink-0 w-20 h-20">
                    <AlbumArt
                      artist={song.artist}
                      album={song.songTitle}
                      discogsImage={song.albumArt}
                      alt={song.songTitle}
                      className="w-full h-full object-cover rounded-xl shadow-md"
                    />
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block bg-jukebox-red text-white px-3 py-1 rounded-full text-xs font-metropolis-bold">
                        #{song.select.selection}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-metropolis-bold ${
                          song.select.state === "on"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {song.select.state.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-metropolis-bold text-jukebox-black mb-1">
                      {song.songTitle}
                    </h3>
                    <p className="text-gray-600 font-metropolis">
                      {song.artist}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditSong(song)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="Edit song"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSong(song)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete song"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm font-metropolis">
                    <div>
                      <span className="text-gray-500">Side:</span>
                      <span className="ml-2 font-metropolis-bold">
                        {song.side}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">P-Trains:</span>
                      <span className="ml-2 font-metropolis-bold">
                        [{song.select.ptrains.join(", ")}]
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Delay:</span>
                      <span className="ml-2 font-metropolis-bold">
                        {song.select.ptrainDelay}ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar for Staged Changes */}
      {stagedSongs && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-jukebox-red shadow-lg z-50">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-6xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-jukebox-red rounded-full animate-pulse"></div>
                <p className="text-base font-metropolis-bold text-jukebox-black">
                  Unsaved Changes
                </p>
                <p className="text-sm font-metropolis text-gray-600">
                  You have reordered your songs
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancelOrder}
                  disabled={isSaving}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-metropolis-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOrder}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-jukebox-red text-white rounded-xl font-metropolis-bold hover:bg-[#b73145] transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Order"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6" />
            <div>
              <p className="font-metropolis-bold text-base">Success!</p>
              <p className="font-metropolis text-sm">
                Song order saved successfully
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
