/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetBooksQuery } from "../../api/book/query";
import { useState } from "react";
import { CreateReview } from "../Review/create-review";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";

export function UserListBooks() {
  const { data, isLoading, isError, error } = useGetBooksQuery();
  const [visibleBooks, setVisibleBooks] = useState(6);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const handleLoadMore = () => setVisibleBooks((prev) => prev + 3);
  const handleShowLess = () => setVisibleBooks((prev) => prev - 3);

  const toggleDescription = (bookId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg shadow">
          {error.message}
        </div>
      </div>
    );
  }

  const bookData = data?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookData.slice(0, visibleBooks).map((book) => {
            const isDescriptionExpanded = expandedDescriptions[book._id];

            return (
              <div
                key={book._id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105"
              >
                {/* Image Container with Overlay */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={book.image || "/Defaultbook.png"}
                    alt={book.Title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  {/* Gradient Overlay - Always visible but more prominent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Title and Author Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-0 transition-transform duration-300">
                    <h2 className="text-2xl font-bold mb-2 text-white">
                      {book.Title}
                    </h2>
                    <p className="text-sm font-medium text-amber-200">
                      by {book.author}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Genres */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {book.genres.split(",").map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium text-amber-800 bg-amber-100 rounded-full"
                      >
                        {genre.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                      <BookOpen size={16} />
                      Description
                    </h3>
                    <div className="relative">
                      <p
                        className={`text-sm text-gray-600 leading-relaxed ${
                          !isDescriptionExpanded && "line-clamp-3"
                        }`}
                      >
                        {book.description || "No description available."}
                      </p>
                      {book.description && book.description.length > 50 && (
                        <button
                          className="mt-2 text-amber-600 text-sm font-medium flex items-center gap-1 hover:text-amber-700 transition-colors"
                          onClick={() => toggleDescription(book._id)}
                        >
                          {isDescriptionExpanded ? (
                            <>
                              Show Less <ChevronUp size={14} />
                            </>
                          ) : (
                            <>
                              Read More <ChevronDown size={14} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Write Review Button */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors duration-200"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More / Show Less Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          {visibleBooks < bookData.length && (
            <button
              className="px-6 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors duration-200 flex items-center gap-2"
              onClick={handleLoadMore}
            >
              Load More <ChevronDown size={16} />
            </button>
          )}
          {visibleBooks > 6 && (
            <button
              className="px-6 py-2 bg-white text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors duration-200 flex items-center gap-2"
              onClick={handleShowLess}
            >
              Show Less <ChevronUp size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedBook && (
        <CreateReview
          bookId={selectedBook._id}
          title={selectedBook.Title}
          author={selectedBook.author}
          genres={selectedBook.genres}
          description={selectedBook.description}
          imageUrl={selectedBook.image || "/Defaultbook.png"}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}

export default UserListBooks;
