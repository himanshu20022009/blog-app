import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-500">
        Error 404
      </p>
      <h1 className="mb-4 text-4xl font-bold text-gray-800">Page not found</h1>
      <p className="mb-8 max-w-md text-gray-600">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="rounded bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
      >
        Back to home
      </Link>
    </main>
  );
}

export default NotFound;
