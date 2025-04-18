/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMangaById } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import WishlistButton from "./components/WishlistButton";


export async function generateMetadata(
  { params }: any
): Promise<Metadata> {
  try {
    const { id } = await params;

    const response = await getMangaById(id);
    const manga = response.data;

    if (!manga) {
      return {
        title: "Manga Not Found",
        description: "The requested manga could not be found."
      };
    }

    return {
      title: `${manga.title} | AnimeHub`,
      description: manga.synopsis?.substring(0, 160) || `Details about ${manga.title}`,
      openGraph: {
        title: manga.title,
        description: manga.synopsis?.substring(0, 160) || `Details about ${manga.title}`,
        images: manga.images?.jpg?.large_image_url ? [manga.images.jpg.large_image_url] : [],
        type: 'website',
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Manga Details | AnimeHub',
      description: 'Explore detailed information about manga titles.',
    };
  }
}

export default async function MangaDetailPage(
  { params }: any
) {
  try {
    const { id } = await params;
    
    const response = await getMangaById(id);
    
    if (!response || !response.data) {
      return (
        <div className="text-center py-10">
          <div className="text-red-500 mb-4">Manga not found</div>
          <Link
            href="/manga"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Manga
          </Link>
        </div>
      );
    }
    
    const manga = response.data;
    
    return (
      <div>
        <div className="mb-8">
          <Link
            href="/manga"
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
            Back to Manga List
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Manga image */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md">
              <Image
                src={manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || 'https://via.placeholder.com/225x350?text=No+Image'}
                alt={manga.title || 'Manga image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>

            {/* Wishlist button - client component */}
            <div className="mt-4">
              <WishlistButton manga={manga} mangaId={parseInt(id, 10)} />
            </div>
          </div>

          {/* Manga details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{manga.title}</h1>
            {manga.title_english && manga.title_english !== manga.title && (
              <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {manga.title_english}
              </h2>
            )}

            {/* Basic info */}
            <div className="flex flex-wrap gap-2 mb-6">
              {manga.score && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md font-medium">
                  ★ {manga.score.toFixed(1)}
                </span>
              )}
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                {manga.type || "Unknown"}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                {manga.status || "Unknown status"}
              </span>
              {manga.chapters && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                  {manga.chapters} chapters
                </span>
              )}
              {manga.volumes && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                  {manga.volumes} volumes
                </span>
              )}
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Synopsis</h3>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {manga.synopsis || "No synopsis available."}
              </p>
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div>
                {/* Genres */}
                {manga.genres && manga.genres.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {manga.genres.map((genre) => (
                        <Link
                          key={genre.mal_id}
                          href={`/manga?genres=${genre.mal_id}`}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm transition-colors"
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Themes */}
                {manga.themes && manga.themes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      {manga.themes.map((theme) => (
                        <span key={theme.mal_id} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                          {theme.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Demographics */}
                {manga.demographics && manga.demographics.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Demographics</h3>
                    <div className="flex flex-wrap gap-2">
                      {manga.demographics.map((demographic) => (
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
                    {manga.published && (
                      <li className="flex">
                        <span className="font-medium w-25">Published:</span>
                        <span>
                          {manga.published.from ? new Date(manga.published.from).toLocaleDateString() : "?"} to{" "}
                          {manga.published.to
                            ? new Date(manga.published.to).toLocaleDateString()
                            : "?"}
                        </span>
                      </li>
                    )}
                    {manga.authors && manga.authors.length > 0 && (
                      <li className="flex">
                        <span className="font-medium w-25">Authors:</span>
                        <span>
                          {manga.authors.map((author) => author.name).join(", ")}
                        </span>
                      </li>
                    )}
                    {manga.serializations && manga.serializations.length > 0 && (
                      <li className="flex">
                        <span className="font-medium w-25">Serialization:</span>
                        <span>
                          {manga.serializations.map((serial) => serial.name).join(", ")}
                        </span>
                      </li>
                    )}
                    {manga.rank && (
                      <li className="flex">
                        <span className="font-medium w-25">Rank:</span>
                        <span>#{manga.rank}</span>
                      </li>
                    )}
                    {manga.popularity && (
                      <li className="flex">
                        <span className="font-medium w-25">Popularity:</span>
                        <span>#{manga.popularity}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Background */}
            {manga.background && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Background</h3>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {manga.background}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    );
    
  } catch (error) {
    console.error("Error fetching manga details:", error);
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">Failed to load manga details. Please try again later.</div>
        <Link
          href="/manga"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Manga
        </Link>
      </div>
    );
  }
} 