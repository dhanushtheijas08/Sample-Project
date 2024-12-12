/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Game from "@/components/apps/game/game";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GamePage() {
  const [levelData, setLevelData] = useState<any>(null);

  useEffect(() => {
    const storedLevel = localStorage.getItem("level");
    if (storedLevel) {
      setLevelData(JSON.parse(storedLevel));
    }
  }, []);

  if (!levelData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full relative">
      <div className="flex flex-col md:hidden max-h-[70vh] items-center overflow-hidden">
        <p className="text-sm max-w-xs text-center text-muted-foreground">
          Unfortunately, this game isn&apos;t supported on mobile devices right
          now.{" "}
        </p>
        <Button className="mt-3" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
      <Game data={levelData} docId={levelData.resentSubmission.gamePlayId} />
    </div>
  );
}
