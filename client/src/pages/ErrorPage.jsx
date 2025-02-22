import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-4">The page you are looking for does not exist.</p>
      <button
        className="mt-6 px-6 py-2 bg-slate-800 text-white hover:bg-slate-600 rounded-md"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
};

export default ErrorPage;
