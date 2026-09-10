import React, { useState } from "react";

function Avatar({ name, src, alt = "avatar", className = "" }) {
  const [hasError, setHasError] = useState(false);
  const initials = (name || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-blue-500 font-semibold text-white ${className}`}
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

export default Avatar;
