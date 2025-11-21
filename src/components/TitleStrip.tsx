import stringBg from "@/js/components/Assets/string_bg.svg";

interface TitleStripProps {
  title: string;
  artist: string;
  titleBottom?: string; // Optional bottom title for A/B side display
  className?: string;
}

export const TitleStrip = ({
  title,
  artist,
  titleBottom,
  className = "",
}: TitleStripProps) => {
  return (
    <div
      className={`w-full py-2 rounded-[12px] bg-[#f6ccd6] text-center ${className}`}
    >
      <p className="font-metropolis-bold text-xl sm:text-2xl tracking-tight font-bold">
        {title}
      </p>

      <div className="relative mx-auto my-2 flex w-full items-center justify-center">
        <img src={stringBg} alt="" className="w-full object-contain" />
        <span className="absolute flex items-center justify-center font-metropolis-bold font-bold text-lg sm:text-xl text-jukebox-black">
          {artist}
        </span>
      </div>

      <p className="font-metropolis-bold text-xl sm:text-2xl font-bold">
        {titleBottom || title}
      </p>
    </div>
  );
};
