/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAnimeById } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import WishlistButton from "./components/WishlistButton";
import { Metadata } from "next";



export async function generateMetadata(
  { params }: any
): Promise<Metadata> {
  try {
    const { id } = await params;

    const response = await getAnimeById(id);
    const anime = response.data;

    if (!anime) {
      return {
        title: "Anime Not Found",
        description: "The requested anime could not be found."
      };
    }

    return {
      title: `${anime.title} | AnimeHub`,
      description: anime.synopsis?.substring(0, 160) || `Details about ${anime.title}`,
      openGraph: {
        title: anime.title,
        description: anime.synopsis?.substring(0, 160) || `Details about ${anime.title}`,
        images: anime.images?.jpg?.large_image_url ? [anime.images.jpg.large_image_url] : [],
        type: 'website',
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Anime Details | AnimeHub',
      description: 'Explore detailed information about anime titles.',
    };
  }
}

export default async function AnimeDetailPage(
  { params }: any
) {
  try {
    const { id } = await params;
    
    const response = await getAnimeById(id);
    
    if (!response || !response.data) {
      return (
        <div className="text-center py-10">
          <div className="text-red-500 mb-4">Anime not found</div>
          <Link
            href="/anime"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Anime
          </Link>
        </div>
      );
    }
    
    const anime = response.data;
    
    return (
      <div>
        <div className="mb-8">
          <Link
            href="/anime"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Anime List
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Anime image */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md">
              <Image
                src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || 'https://via.placeholder.com/225x350?text=No+Image'}
                alt={anime.title || 'Anime image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>

            {/* Wishlist button - moved to client component */}
            <div className="mt-4">
              <WishlistButton anime={anime} animeId={parseInt(id, 10)} />
            </div>
          </div>

          {/* Anime details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{anime.title}</h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {anime.title_english}
              </h2>
            )}

            {/* Basic info */}
            <div className="flex flex-wrap gap-2 mb-6">
              {anime.score && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md font-medium">
                  ★ {anime.score.toFixed(1)}
                </span>
              )}
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                {anime.type || "Unknown"}
              </span>
              {anime.episodes && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                  {anime.episodes} episodes
                </span>
              )}
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                {anime.status || "Unknown status"}
              </span>
              {anime.rating && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                  {anime.rating}
                </span>
              )}
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Synopsis</h3>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div>
                {/* Genres */}
                {anime.genres && anime.genres.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre) => (
                        <Link
                          key={genre.mal_id}
                          href={`/anime?genres=${genre.mal_id}`}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm transition-colors"
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Themes */}
                {anime.themes && anime.themes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.themes.map((theme) => (
                        <span key={theme.mal_id} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                          {theme.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Demographics */}
                {anime.demographics && anime.demographics.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Demographics</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.demographics.map((demographic) => (
                        <span key={demographic.mal_id} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                          {demographic.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div>
                {/* Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Information</h3>
                  <ul className="space-y-2">
                    {anime.aired && (
                      <li className="flex">
                        <span className="font-medium w-25">Aired:</span>
                        <span>
                          {anime.aired.from ? new Date(anime.aired.from).toLocaleDateString() : "?"} to{" "}
                          {anime.aired.to
                            ? new Date(anime.aired.to).toLocaleDateString()
                            : "?"}
                        </span>
                      </li>
                    )}
                    {anime.season && (
                      <li className="flex">
                        <span className="font-medium w-25">Season:</span>
                        <span className="capitalize">
                          {anime.season} {anime.year || ""}
                        </span>
                      </li>
                    )}
                    {anime.duration && (
                      <li className="flex">
                        <span className="font-medium w-25">Duration:</span>
                        <span>{anime.duration}</span>
                      </li>
                    )}
                    {anime.source && (
                      <li className="flex">
                        <span className="font-medium w-25">Source:</span>
                        <span>{anime.source}</span>
                      </li>
                    )}
                    {anime.rank && (
                      <li className="flex">
                        <span className="font-medium w-25">Rank:</span>
                        <span>#{anime.rank}</span>
                      </li>
                    )}
                    {anime.popularity && (
                      <li className="flex">
                        <span className="font-medium w-25">Popularity:</span>
                        <span>#{anime.popularity}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Trailer */}
            {anime.trailer && anime.trailer.embed_url && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Trailer</h3>
                <div className="aspect-video w-full max-w-2xl">
                  <iframe
                    src={anime.trailer.embed_url}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title={`${anime.title} Trailer`}
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    );
    
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">Failed to load anime details. Please try again later.</div>
        <Link
          href="/anime"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Anime
        </Link>
      </div>
    );
  }
} 