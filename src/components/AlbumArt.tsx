import { useState, useEffect } from "react";
import { getAlbumArt } from "@/lib/lastfm";
import vinylImage from "@/js/components/Assets/vinyl-parr.png";
import { HeartButton } from "@/components/HeartButton";

interface AlbumArtProps {
  artist: string;
  album?: string;
  localImage?: string;
  discogsImage?: string; // Discogs album art URL - takes priority
  alt: string;
  className?: string;
  songId?: string; // Song ID for favorite functionality
  isFavorited?: boolean; // Whether the song is favorited
  showHeart?: boolean; // Whether to show the heart button (default: false)
}

export const AlbumArt = ({
  artist,
  album,
  localImage,
  discogsImage,
  alt,
  className = "",
  songId,
  isFavorited,
  showHeart = false,
}: AlbumArtProps) => {
  const [imageSrc, setImageSrc] = useState<string>(
    discogsImage || localImage || vinylImage
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAlbumArt = async () => {
      // Priority order: Discogs image > Local image > Last.fm > Vinyl fallback
      if (discogsImage) {
        setImageSrc(discogsImage);
        setIsLoading(false);
        return;
      }

      if (localImage) {
        setImageSrc(localImage);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Try to fetch from Last.fm
      const lastFmImage = await getAlbumArt(artist, album);

      if (isMounted) {
        if (lastFmImage) {
          setImageSrc(lastFmImage);
        } else {
          // Fallback to vinyl image if Last.fm fails
          setImageSrc(vinylImage);
        }
        setIsLoading(false);
      }
    };

    fetchAlbumArt();

    return () => {
      isMounted = false;
    };
  }, [artist, album, localImage, discogsImage]);

  return (
    <div className="relative w-full h-full">
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-50" : "opacity-100"
        } transition-opacity`}
        onError={() => setImageSrc(vinylImage)}
      />
      {showHeart && songId && (
        <div className="absolute top-0 right-0 z-10">
          <HeartButton
            songId={songId}
            isFavorited={isFavorited}
            className="transition hover:opacity-80"
          />
        </div>
      )}
    </div>
  );
};
