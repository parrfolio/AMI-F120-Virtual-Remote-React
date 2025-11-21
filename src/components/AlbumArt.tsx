import { useState, useEffect } from "react";
import { getAlbumArt } from "@/lib/lastfm";
import vinylImage from "@/js/components/Assets/vinyl.png";

interface AlbumArtProps {
  artist: string;
  album?: string;
  localImage?: string;
  discogsImage?: string; // Discogs album art URL - takes priority
  alt: string;
  className?: string;
}

export const AlbumArt = ({
  artist,
  album,
  localImage,
  discogsImage,
  alt,
  className = "",
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
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${
        isLoading ? "opacity-50" : "opacity-100"
      } transition-opacity`}
      onError={() => setImageSrc(vinylImage)}
    />
  );
};
