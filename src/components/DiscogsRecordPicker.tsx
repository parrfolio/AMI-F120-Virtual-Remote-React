import React, { useState, useEffect, useRef } from "react";
import {
  getUserSevenInchCollection,
  getReleaseDetails,
  parseTracklist,
  getBestImage,
  DiscogsRelease,
  DiscogsReleaseDetails,
} from "@/lib/discogs";
import { getTrackDuration } from "@/lib/lastfm";
import { Song } from "@/types";
import { Music, Trash2 } from "lucide-react";

interface DiscogsRecordPickerProps {
  username: string;
  existingSongs: Song[];
  onSelectRecord: (songs: {
    aSide: Partial<Song>;
    bSide: Partial<Song>;
  }) => void;
  onRemoveRecord: (albumArt: string) => void;
  maxSongs?: number;
}

export const DiscogsRecordPicker: React.FC<DiscogsRecordPickerProps> = ({
  username,
  existingSongs,
  onSelectRecord,
  onRemoveRecord,
  maxSongs = 120,
}) => {
  const [records, setRecords] = useState<DiscogsRelease[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DiscogsRelease | null>(
    null
  );
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const observerTarget = useRef<HTMLDivElement>(null);

  // Load initial collection when component mounts
  useEffect(() => {
    if (records.length === 0) {
      loadCollection(1);
    }
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadCollection(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, page]);

  const loadCollection = async (pageNum: number) => {
    if (loading) return;

    setLoading(true);
    setError(null);
    try {
      const { releases, pagination } = await getUserSevenInchCollection(
        username,
        pageNum,
        20
      );

      setRecords((prev) => (pageNum === 1 ? releases : [...prev, ...releases]));
      setPage(pageNum);
      setHasMore(pageNum < pagination.pages);
      setTotalRecords(pagination.items);
    } catch (err) {
      setError("Failed to load Discogs collection");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check if a record is already in the jukebox
  const isRecordInJukebox = (coverImage: string): boolean => {
    return existingSongs.some((song) => song.albumArt === coverImage);
  };

  const handleSelectRecord = async (record: DiscogsRelease) => {
    const coverImage = record.basic_information.cover_image;

    // Check if already in jukebox - if so, trigger remove
    if (isRecordInJukebox(coverImage)) {
      onRemoveRecord(coverImage);
      return;
    }

    // Check if adding would exceed max songs (each disc = 2 songs)
    if (existingSongs.length + 2 > maxSongs) {
      return; // Silently prevent adding - warning is shown in parent
    }

    setSelectedRecord(record);
    setLoadingDetails(true);

    try {
      // Fetch full release details to get tracklist
      const details: DiscogsReleaseDetails = await getReleaseDetails(
        record.basic_information.id
      );
      const { aSide, bSide } = parseTracklist(details.tracklist);
      const albumArt = getBestImage(details);
      const artist = details.artists.map((a) => a.name).join(", ");

      // Helper to convert duration string to seconds
      const durationToSeconds = (duration: string | undefined): number => {
        if (!duration) return 180;
        const parts = duration.split(":");
        if (parts.length !== 2) return 180;
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        if (isNaN(minutes) || isNaN(seconds)) return 180;
        return minutes * 60 + seconds;
      };

      // Get duration from Discogs or fallback to Last.fm
      const getTrackDurationWithFallback = async (
        track: typeof aSide | typeof bSide,
        artist: string
      ): Promise<number> => {
        // Try Discogs duration first
        if (track?.duration) {
          const discogsDuration = durationToSeconds(track.duration);
          if (discogsDuration > 0) {
            return discogsDuration;
          }
        }

        // Fallback to Last.fm
        if (track?.title) {
          try {
            const lastfmDuration = await getTrackDuration(artist, track.title);
            if (lastfmDuration && lastfmDuration > 0) {
              console.log(
                `Fetched duration from Last.fm for "${track.title}": ${lastfmDuration}s`
              );
              return lastfmDuration;
            }
          } catch (error) {
            console.error("Failed to fetch duration from Last.fm:", error);
          }
        }

        // Default to 3 minutes
        return 180;
      };

      // Fetch durations (with Last.fm fallback if needed)
      const [aSideDuration, bSideDuration] = await Promise.all([
        getTrackDurationWithFallback(aSide, artist),
        getTrackDurationWithFallback(bSide, artist),
      ]);

      // Create partial song objects for form pre-population
      const aSideSong: Partial<Song> = {
        songTitle: aSide?.title || "",
        side: "A Side" as const,
        artist: artist,
        albumArt: albumArt,
        duration: aSideDuration,
      };

      const bSideSong: Partial<Song> = {
        songTitle: bSide?.title || "",
        side: "B Side" as const,
        artist: artist,
        albumArt: albumArt,
        duration: bSideDuration,
      };

      onSelectRecord({ aSide: aSideSong, bSide: bSideSong });
    } catch (err) {
      console.error("Error loading record details:", err);
      setError("Failed to load record details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filter records based on search query
  const filteredRecords = records.filter((record) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const title = record.basic_information.title.toLowerCase();
    const artist = record.basic_information.artists
      .map((a) => a.name)
      .join(", ")
      .toLowerCase();
    const year = record.basic_information.year?.toString() || "";

    return (
      title.includes(query) || artist.includes(query) || year.includes(query)
    );
  });

  return (
    <div className="mb-6 border-2 border-jukebox-red rounded-lg p-4 bg-white shadow-lg max-h-[600px] overflow-y-auto relative">
      {loadingDetails && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 rounded-lg">
          <p className="text-lg font-metropolis">Loading record details...</p>
        </div>
      )}

      {/* Search Input */}
      <div className="mb-4 sticky top-0 z-20 pb-4 border-b-2 border-gray-100">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, artist, or year..."
          className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl font-metropolis focus:border-jukebox-red focus:outline-none focus:ring-2 focus:ring-jukebox-red/20"
        />
        {searchQuery && (
          <div className="mt-2 text-sm font-metropolis text-gray-600">
            Found {filteredRecords.length} of {records.length} records
          </div>
        )}
      </div>

      {loading && page === 1 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Loading collection...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {records.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-8">
          No 7" records found in your collection
        </p>
      )}

      {filteredRecords.length === 0 && records.length > 0 && searchQuery && (
        <p className="text-center text-gray-500 py-8">
          No records match your search "{searchQuery}"
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredRecords.map((record) => {
          const { basic_information: info } = record;
          const artist = info.artists.map((a) => a.name).join(", ");
          const isSelected = selectedRecord?.instance_id === record.instance_id;
          const inJukebox = isRecordInJukebox(info.cover_image);
          const atCapacity = existingSongs.length >= maxSongs && !inJukebox;

          return (
            <button
              key={record.instance_id}
              onClick={() => handleSelectRecord(record)}
              disabled={atCapacity}
              className={`
                group relative overflow-hidden rounded-lg transition-all
                ${
                  atCapacity
                    ? "opacity-40 cursor-not-allowed"
                    : inJukebox
                    ? " ring-green-500 shadow-xl"
                    : isSelected
                    ? " ring-jukebox-red shadow-xl scale-105"
                    : "hover:shadow-xl hover:scale-105"
                }
              `}
            >
              {/* Album Cover */}
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={info.cover_image}
                  alt={info.title}
                  className={`w-full h-full object-cover ${
                    inJukebox ? "opacity-50" : ""
                  }`}
                  loading="lazy"
                />

                {/* In Jukebox Indicator */}
                {inJukebox && (
                  <div className="absolute inset-0 bg-green-500/30 flex flex-col items-center justify-center">
                    <Music className="h-12 w-12 text-white mb-2" />
                    <span className="text-white font-metropolis-bold text-xs bg-black/50 px-2 py-1 rounded">
                      In Jukebox
                    </span>
                  </div>
                )}

                {/* Overlay on hover */}
                <div
                  className={`absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center ${
                    inJukebox ? "bg-red-600/80" : ""
                  }`}
                >
                  {inJukebox ? (
                    <>
                      <Trash2 className="h-8 w-8 text-white mb-2" />
                      <span className="text-white font-metropolis-bold text-sm px-2 text-center">
                        Click to Remove
                      </span>
                    </>
                  ) : (
                    <span className="text-white font-metropolis-bold text-sm px-2 text-center">
                      Click to Add
                    </span>
                  )}
                </div>
              </div>

              {/* Record Info */}
              <div
                className={`p-2 bg-white border-t-2 ${
                  inJukebox ? "border-green-500" : "border-jukebox-red"
                }`}
              >
                <p
                  className="font-metropolis-bold text-sm truncate"
                  title={info.title}
                >
                  {info.title}
                </p>
                <p
                  className="font-metropolis text-xs text-gray-600 truncate"
                  title={artist}
                >
                  {artist}
                </p>
                <p className="font-metropolis text-xs text-gray-400">
                  {info.year}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Loading indicator for infinite scroll */}
      {loading && page > 1 && (
        <div className="text-center py-4">
          <p className="text-sm font-metropolis text-gray-600">
            Loading more records...
          </p>
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && !loading && <div ref={observerTarget} className="h-4" />}

      {!hasMore && records.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm font-metropolis text-gray-500">
            All records loaded
          </p>
        </div>
      )}
    </div>
  );
};
