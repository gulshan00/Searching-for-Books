"use client";
import { useState, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Book = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
};

const categories = [
  { label: "All", value: "" },
  { label: "Fiction", value: "subject:Fiction" },
  { label: "Science", value: "subject:Science" },
  { label: "Technology", value: "subject:Technology" },
  { label: "History", value: "subject:History" },
  { label: "Business", value: "subject:Business" },
];

export default function BookFinder() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const maxResults = 12;

  useEffect(() => {
    fetchBooks("bestseller", category, 0);
  }, [category]);

  const fetchBooks = async (searchTerm: string, category: string, pageIndex: number) => {
    setLoading(true);
    try {
      const startIndex = pageIndex * maxResults;
      const queryString = `${searchTerm} ${category}`.trim();
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          queryString
        )}&startIndex=${startIndex}&maxResults=${maxResults}`
      );
      const data = await res.json();
      setBooks(data.items || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const searchBooks = (e?: KeyboardEvent<HTMLInputElement>) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setPage(0); // reset to first page
    fetchBooks(query, category, 0);
  };

  const handleViewDetails = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBooks(query || "bestseller", category, nextPage);
  };

  const handlePrevPage = () => {
    if (page === 0) return;
    const prevPage = page - 1;
    setPage(prevPage);
    fetchBooks(query || "bestseller", category, prevPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BookVerse
            </h1>
          </div>
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative group flex-1">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
                🔍
              </div>
              <input
                type="text"
                placeholder="Discover your next great read..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchBooks(e)}
                className="w-full pl-10 sm:pl-12 pr-24 sm:pr-32 py-3 sm:py-4 text-black text-base sm:text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-black"
              />
              <button
                onClick={() => searchBooks()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-xl hover:scale-105 transition-transform duration-200 font-medium text-sm sm:text-base"
              >
                Search
              </button>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none bg-white/80 backdrop-blur-sm text-black text-sm sm:text-base"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            <span className="ml-4 text-lg text-gray-600">
              Finding amazing books...
            </span>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => {
            const info = book.volumeInfo;
            return (
              <div
                key={book.id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/50"
              >
                {/* Book Cover */}
                <div
                  className="relative overflow-hidden cursor-pointer w-full h-64 sm:h-72"
                  onClick={() => handleViewDetails(book.id)}
                >
                  <Image
                    src={
                      info.imageLinks?.thumbnail?.replace("http:", "https:") ||
                      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"
                    }
                    alt={info.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Book Info */}
                <div className="p-6 space-y-3">
                  <h2
                    className="font-bold text-lg leading-tight text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(book.id)}
                  >
                    {info.title}
                  </h2>

                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="mr-2">👤</span>
                    <span className="line-clamp-1">
                      {info.authors?.join(", ") || "Unknown Author"}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <span className="mr-2">📅</span>
                    <span>{info.publishedDate?.slice(0, 4) || "N/A"}</span>
                  </div>

                  {info.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {info.description.replace(/<[^>]*>/g, "")}
                    </p>
                  )}

                  <button
                    onClick={() => handleViewDetails(book.id)}
                    className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {!loading && books.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrevPage}
              disabled={page === 0}
              className={`px-4 py-2 rounded-lg font-medium ${page === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
            >
              Prev
            </button>
            <span className="text-gray-700 font-medium">Page {page + 1}</span>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 rounded-lg font-medium bg-indigo-500 text-white hover:bg-indigo-600"
            >
              Next
            </button>
          </div>
        )}
        {!loading && books.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No books found
            </h3>
            <p className="text-gray-500">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
