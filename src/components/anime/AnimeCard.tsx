"use client";

import { Anime } from "@/lib/api";
import MediaCard from "@/components/shared/MediaCard";

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return <MediaCard media={anime} mediaType="anime" />;
} 