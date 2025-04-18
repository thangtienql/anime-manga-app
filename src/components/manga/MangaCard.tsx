"use client";

import { Manga } from "@/lib/api";
import MediaCard from "@/components/shared/MediaCard";

interface MangaCardProps {
  manga: Manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
  return <MediaCard media={manga} mediaType="manga" />;
} 