/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const CustomLoadingSpinner = ({ percentage }: { percentage: number }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-[rgb(31,31,32)]"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className="text-gray-300"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          style={{
            transformOrigin: "50% 50%",
            transform: "rotate(-90deg)",
            transition: "stroke-dashoffset 0.35s",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-300">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const Game = ({ data, docId }: { data: any; docId: string }) => {
  const { user } = useAuth();

  const gameDataRef = useRef({
    loaderUrl: data.gameFiles.loader,
    dataUrl: data.gameFiles.data,
    frameworkUrl: data.gameFiles.framework,
    codeUrl: data.gameFiles.wasm,
  });

  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext({
      ...gameDataRef.current,
    });
  useEffect(() => {
    const payload = {
      token: user?.userToken,
      getGameDataApi:
        "https://us-central1-wefaa-robotics.cloudfunctions.net/getSavedGamePlayData",
      setGameDataApi:
        "https://us-central1-wefaa-robotics.cloudfunctions.net/submitGamePlayData",
      saveGameDataApi:
        "https://us-central1-wefaa-robotics.cloudfunctions.net/saveGamePlayData",
      levelId: docId,
      gamePlayId: docId,
    };

    if (isLoaded) {
      sendMessage("Networking", "SetUpNetworking", JSON.stringify(payload));
    }
  }, [isLoaded, sendMessage, user?.userToken, docId]);
  const loadingPercentage = loadingProgression * 100;

  return (
    <>
      <div className="demoWrapper hidden md:block">
        <div className="sample-div">
          <Unity className="h-full w-full" unityProvider={unityProvider} />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[rgb(31,31,32)] bg-opacity-70">
              <CustomLoadingSpinner percentage={loadingPercentage} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Game;

// loaderUrl:
//   "https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/new-file%2FGardenTheme5.loader.js?alt=media&token=1f97bf5c-e5f2-4c61-956a-0bf2ad68ebd7",
// dataUrl:
//   "https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/new-file%2FGardenTheme5.data?alt=media&token=c04d3b8b-c3c5-4888-9c50-9429bcfa30a6",
// frameworkUrl:
//   "https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/new-file%2FGardenTheme5.framework.js?alt=media&token=0a76871f-92ef-4687-83db-8c93982f79ce",
// codeUrl:
//   "https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/new-file%2FGardenTheme5.wasm?alt=media&token=4200fabe-32d4-4093-a5bf-e79a5ab21a0d",
// loaderUrl: "/game-file/GardenTheme5.loader.js",
// dataUrl: "/game-file/GardenTheme5.data",
// frameworkUrl: "/game-file/GardenTheme5.framework.js",
// codeUrl: "/game-file/GardenTheme5.wasm",
