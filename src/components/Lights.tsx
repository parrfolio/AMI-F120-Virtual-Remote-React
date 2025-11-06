import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Header } from "@/components/Header";
import { useLightsStore } from "@/stores/lightsStore";
import { animationThemes, animationNames } from "@/data/animations.ts";
import { SocketLightsData, SocketLightsResponse } from "@/types";

export const Lights = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const { running, animation, active, setAnimation, setRunning, setActive } =
    useLightsStore();

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setSocketConnected(true);
    });

    newSocket.on("disconnect", () => {
      setSocketConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

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

      <div className="container mx-auto px-4 py-8">
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

            return (
              <button
                key={name}
                onClick={() => toggleAnimation(name, index)}
                className={`p-8 rounded-lg shadow-lg transition-all transform hover:scale-105 ${
                  isActive
                    ? "bg-jukebox-pink text-white ring-4 ring-jukebox-pink ring-opacity-50"
                    : "bg-white text-gray-900 hover:shadow-xl"
                }`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isActive ? "bg-white bg-opacity-20" : "bg-gray-100"
                    }`}
                  >
                    {isCurrentlyRunning && (
                      <div className="w-8 h-8 rounded-full bg-current animate-ping" />
                    )}
                  </div>

                  <h3 className="text-xl font-metropolis-bold capitalize">
                    {name}
                  </h3>

                  <p className="text-sm opacity-75">
                    {isCurrentlyRunning ? "Running..." : "Click to activate"}
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
