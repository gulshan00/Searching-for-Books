"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function BookDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book || !book.volumeInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Book Not Found</h2>
          <p className="text-gray-500 mb-6">The book you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-200 font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const info = book.volumeInfo;
  const saleInfo = book.saleInfo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <span className="text-xl">←</span>
            Back to Search
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/50">
          <div className="flex flex-col lg:flex-row gap-8 p-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="relative w-[300px] h-[450px]">
                <Image
                  src={
                    info.imageLinks?.large ||
                    info.imageLinks?.medium ||
                    info.imageLinks?.thumbnail?.replace("http:", "https:") ||
                    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"
                  }
                  alt={info.title || "Book cover"}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              {info.averageRating && (
                <div className="mt-6 text-center">
                  <div className="flex justify-center items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${i < Math.floor(info.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {info.averageRating}/5 ({info.ratingsCount || 0} reviews)
                  </p>
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="flex flex-col flex-grow space-y-6">
              {/* Title & Author */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3 leading-tight">
                  {info.title}
                </h1>
                {info.subtitle && (
                  <h2 className="text-xl text-gray-600 mb-3">{info.subtitle}</h2>
                )}
                <div className="flex items-center text-lg text-gray-700 mb-2">
                  <span className="mr-2">👤</span>
                  <span className="font-medium">{info.authors?.join(", ") || "Unknown Author"}</span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {info.publishedDate && (
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📅</span>
                      <span>Published: {info.publishedDate}</span>
                    </div>
                  )}

                  {info.publisher && (
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">🏢</span>
                      <span>{info.publisher}</span>
                    </div>
                  )}

                  {info.pageCount && (
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📄</span>
                      <span>{info.pageCount} pages</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {info.language && (
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">🌐</span>
                      <span>Language: {info.language.toUpperCase()}</span>
                    </div>
                  )}

                  {saleInfo?.listPrice && (
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">💰</span>
                      <span>{saleInfo.listPrice.amount} {saleInfo.listPrice.currencyCode}</span>
                    </div>
                  )}

                  {info.printType && (
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📖</span>
                      <span>{info.printType}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {info.categories && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {info.categories.map((category: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm rounded-full border border-indigo-200"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {info.description && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Description</h3>
                  <div
                    className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: info.description.replace(/<br\s*\/?>/gi, '<br />')
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {info.previewLink && (
                  <a
                    href={info.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-200 font-medium shadow-lg"
                  >
                    <span>📖</span>
                    Preview Book
                  </a>
                )}

                {saleInfo?.buyLink && (
                  <a
                    href={saleInfo.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-200 font-medium shadow-lg"
                  >
                    <span>🛒</span>
                    Buy Book
                  </a>
                )}

                {info.infoLink && (
                  <a
                    href={info.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-200 font-medium shadow-lg"
                  >
                    <span>ℹ️</span>
                    More Info
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}