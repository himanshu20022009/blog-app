import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function CreatorBlogs() {
  const { id } = useParams();
  const { blogs } = useAuth();
  const creatorBlogs = blogs?.filter(
    (blog) => String(blog.createdBy) === String(id)
  );

  return (
    <div className="container mx-auto my-12 p-4">
      <h1 className="text-2xl font-bold mb-8">Creator&apos;s Blogs</h1>
      {creatorBlogs && creatorBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creatorBlogs.map((blog) => (
            <Link
              to={`/blog/${blog._id}`}
              key={blog._id}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={blog.blogImage?.url}
                alt={blog.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">{blog.category}</p>
                <h2 className="text-lg font-semibold mt-1">{blog.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">This creator has not published any blogs yet.</p>
      )}
    </div>
  );
}

export default CreatorBlogs;
