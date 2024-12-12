"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

interface ProfilePickerProps {
  profiles: string[];
  onSelect: (profile: string) => void;
}

export default function ProfilePicker({
  profiles,
  onSelect,
}: ProfilePickerProps) {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const isLoading = false;
  const handleSelect = (profile: string) => {
    setSelectedProfile(profile);
    onSelect(profile);
  };

  return (
    <ScrollArea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
      <div className="p-4 grid grid-cols-5 gap-4 max-h-32">
        {isLoading
          ? Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="w-16 h-16 rounded-full" />
            ))
          : profiles?.map((profile, index) => (
              <div
                key={index}
                className={`relative w-16 h-16 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-black ${
                  selectedProfile === profile ? "ring-2 ring-black" : ""
                }`}
                onClick={() => handleSelect(profile)}
              >
                <Image
                  src={profile}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full object-cover"
                  width={50}
                  height={50}
                />
                {selectedProfile === profile && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Check className="text-white" />
                  </div>
                )}
              </div>
            ))}
      </div>
    </ScrollArea>
  );
}
