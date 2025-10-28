import { useState } from "react";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();

      if (data.docs.length === 0) {
        setError("No results found 😢");
      } else {
        setBooks(data.docs.slice(0, 12)); // show top 12 results
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center p-6 sm:p-10 bg-blue-100 min-h-screen font-serif">
      <h1
        className="text-4xl sm:text-5xl font-bold mb-6 text-green-700"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        📚 Book Finder
      </h1>

      <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6 px-4">
        <input
          type="text"
          placeholder="Enter book name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full sm:w-64 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
        />
        <button
          onClick={handleSearch}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md transition"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-black text-lg">Loading…</p>}
      {error && <p className="text-red-600 text-lg">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
        {books.map((book, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-200"
          >
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="mx-auto mb-3 rounded-md h-48 object-cover"
              />
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">
                No Cover
              </div>
            )}
            <h2 className="text-lg font-semibold text-green-800 mb-1">
              {book.title}
            </h2>
            <p className="text-sm text-gray-700">
              {book.author_name
                ? book.author_name.join(", ")
                : "Unknown Author"}
            </p>
            <p className="text-sm text-gray-600">
              First Published: {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
