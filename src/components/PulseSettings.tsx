import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { LAYOUT_CONFIG } from "@/config/layout";
import { usePlayerStore } from "@/stores/playerStore";
import { usePulseSettingsStore } from "@/stores/pulseSettingsStore";
import { PulseSettingsPayload } from "@/types";
import { ArrowLeft } from "lucide-react";

export const PulseSettings = () => {
  const { socket, socketConnected } = usePlayerStore();
  const { pulseSpeed, pulseDelay, ptrainDelay, setPulseSettings } =
    usePulseSettingsStore();

  useEffect(() => {
    if (!socket || !socketConnected) return;

    const handlePulseSync = (payload: PulseSettingsPayload) => {
      if (payload) {
        setPulseSettings(payload);
      }
    };

    socket.on("pulse-settings:sync", handlePulseSync);
    socket.emit("pulse-settings:request", (response: PulseSettingsPayload) => {
      if (response) {
        setPulseSettings(response);
      }
    });

    return () => {
      socket.off("pulse-settings:sync", handlePulseSync);
    };
  }, [socket, socketConnected, setPulseSettings]);

  const handlePulseSettingChange = (
    key: "pulseSpeed" | "pulseDelay" | "ptrainDelay",
    value: number
  ) => {
    if (Number.isNaN(value)) return;

    const payload: PulseSettingsPayload = {
      pulseSpeed: key === "pulseSpeed" ? value : pulseSpeed,
      pulseDelay: key === "pulseDelay" ? value : pulseDelay,
      ptrainDelay: key === "ptrainDelay" ? value : ptrainDelay,
    };

    setPulseSettings(payload);

    if (socket && socketConnected) {
      socket.emit(
        "pulse-settings:update",
        payload,
        (response: PulseSettingsPayload) => {
          if (response) {
            setPulseSettings(response);
          }
        }
      );
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
      <Header />

      <main
        className={`container mx-auto px-4 sm:px-6 py-6 max-w-3xl relative z-10 ${LAYOUT_CONFIG.HEADER_CLEARANCE.SONG_MANAGER}`}
      >
        <div className="p-8 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-metropolis text-gray-500 uppercase tracking-wide">
                Relay Tuning
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to="/manage"
                  className="text-jukebox-black hover:text-jukebox-red transition-colors"
                >
                  <ArrowLeft className="h-8 w-8" />
                </Link>
                <h1 className="text-4xl font-metropolis-bold text-jukebox-black">
                  Pulse Settings
                </h1>
              </div>
              <p className="text-base font-metropolis text-gray-600 mt-2">
                Fine tune the relay pulse duration and delay to match your
                jukebox hardware.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-metropolis text-gray-600">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  socketConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span>
                {socketConnected
                  ? "Connected to jukebox"
                  : "Connect to adjust timings"}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between text-sm font-metropolis-bold text-gray-700 mb-2">
                <span>Pulse Speed</span>
                <span>{pulseSpeed} ms</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={pulseSpeed}
                onChange={(event) =>
                  handlePulseSettingChange(
                    "pulseSpeed",
                    Number(event.target.value)
                  )
                }
                className="w-full"
                disabled={!socketConnected}
              />
              <p className="text-xs text-gray-500 font-metropolis mt-2">
                Controls how long the relay stays engaged to fire a selection.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm font-metropolis-bold text-gray-700 mb-2">
                <span>Pulse Delay</span>
                <span>{pulseDelay} ms</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={pulseDelay}
                onChange={(event) =>
                  handlePulseSettingChange(
                    "pulseDelay",
                    Number(event.target.value)
                  )
                }
                className="w-full"
                disabled={!socketConnected}
              />
              <p className="text-xs text-gray-500 font-metropolis mt-2">
                Sets the gap between successive relay pulses for dual
                selections.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm font-metropolis-bold text-gray-700 mb-2">
                <span>Pulse Train Delay</span>
                <span>{ptrainDelay} ms</span>
              </div>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={ptrainDelay}
                onChange={(event) =>
                  handlePulseSettingChange(
                    "ptrainDelay",
                    Number(event.target.value)
                  )
                }
                className="w-full"
                disabled={!socketConnected}
              />
              <p className="text-xs text-gray-500 font-metropolis mt-2">
                Delay between the first and second pulse train for dual
                selections.
              </p>
            </div>
          </div>

          {!socketConnected && (
            <p className="text-sm text-red-500 font-metropolis text-center">
              Connect your Raspberry Pi controller to enable adjustments.
            </p>
          )}

          <div className="text-sm text-gray-500 font-metropolis text-center">
            Values are saved instantly when you move the sliders.
          </div>
        </div>
      </main>
    </div>
  );
};
