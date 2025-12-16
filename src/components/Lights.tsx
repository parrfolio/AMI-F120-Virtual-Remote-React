import { Header } from "@/components/Header";
import { useLightsStore } from "@/stores/lightsStore";
import { usePlayerStore } from "@/stores/playerStore";
import { animationThemes, animationNames } from "@/data/animations.ts";
import { SocketLightsData, SocketLightsResponse } from "@/types";
import {
  Sparkles,
  Waves,
  Zap,
  TreePine,
  Radio,
  SunMedium,
  Eye,
  Circle,
} from "lucide-react";
import { LAYOUT_CONFIG } from "@/config/layout";

// Animation configurations with icons and gradients
const animationConfig: Record<
  string,
  { icon: typeof Sparkles; gradient: string }
> = {
  rainbow: {
    icon: Radio,
    gradient:
      "bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500",
  },
  twinkle: {
    icon: Sparkles,
    gradient: "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600",
  },
  colorWave: {
    icon: Waves,
    gradient: "bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500",
  },
  xmas: {
    icon: TreePine,
    gradient: "bg-gradient-to-br from-red-600 via-green-600 to-red-600",
  },
  classic: {
    icon: Zap,
    gradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
  },
  fadeInOut: {
    icon: SunMedium,
    gradient: "bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400",
  },
  cylonEye: {
    icon: Eye,
    gradient: "bg-gradient-to-br from-red-700 via-red-500 to-red-700",
  },
  pacman: {
    icon: Circle,
    gradient: "bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500",
  },
};

export const Lights = () => {
  const { running, animation, active, setAnimation, setRunning, setActive } =
    useLightsStore();

  // Use the global socket from playerStore instead of creating a new one
  const { socket, socketConnected } = usePlayerStore();

  const toggleAnimation = (animationName: string, index: number) => {
    if (!socket || !socketConnected) {
      console.error("Socket not connected");
      return;
    }

    setActive(index);
    setAnimation(animationName);

    const lightData: SocketLightsData = {
      state: running && animation === animationName ? "off" : "on",
      animation: animationName,
      stripConf: animationThemes[animationName],
    };

    socket.emit("lights", lightData, (response: SocketLightsResponse) => {
      setRunning(response.running);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header nav={true} />

      <div
        className={`container mx-auto px-4 py-8 ${LAYOUT_CONFIG.HEADER_CLEARANCE.LIGHTS} ${LAYOUT_CONFIG.PLAYER_CLEARANCE.LIGHTS}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-metropolis-bold text-gray-900">
            Light Animations
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  socketConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {socketConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {running && animation && (
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm text-gray-600">
                  Running: {animation}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animationNames.map((name, index) => {
            const isActive = active === index;
            const isCurrentlyRunning = running && animation === name;
            const config = animationConfig[name];
            const Icon = config?.icon || Sparkles;

            return (
              <button
                key={name}
                onClick={() => toggleAnimation(name, index)}
                className={`relative overflow-hidden rounded-2xl shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl ${
                  isActive
                    ? "ring-4 ring-white ring-opacity-60"
                    : "hover:shadow-xl"
                }`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 ${
                    config?.gradient ||
                    "bg-gradient-to-br from-gray-400 to-gray-600"
                  } ${isActive ? "opacity-100" : "opacity-80"}`}
                />

                {/* Content */}
                <div className="relative p-8 flex flex-col items-center space-y-4 text-white">
                  {/* Icon Circle */}
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm ${
                      isActive
                        ? "bg-white bg-opacity-30 shadow-xl"
                        : "bg-white bg-opacity-20"
                    } transition-all`}
                  >
                    {isCurrentlyRunning ? (
                      <>
                        <Icon className="w-10 h-10 relative z-10" />
                        <div className="absolute inset-0 rounded-full bg-white opacity-50 animate-ping" />
                      </>
                    ) : (
                      <Icon className="w-10 h-10" />
                    )}
                  </div>

                  {/* Animation Name */}
                  <h3 className="text-2xl font-metropolis-bold capitalize drop-shadow-lg">
                    {name}
                  </h3>

                  {/* Status */}
                  <p className="text-sm font-metropolis drop-shadow">
                    {isCurrentlyRunning ? "⚡ Running..." : "Click to activate"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-metropolis-bold text-gray-900 mb-4">
            Animation Info
          </h3>
          <p className="text-gray-600">
            Select an animation to control the LED light strips on your AMi
            F-120 Jukebox. The animations control multiple LED strips including
            title strip lights, cabinet lights, mechanism lights, and door
            lights.
          </p>
        </div>
      </div>
    </div>
  );
};
