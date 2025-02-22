import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold text-red-500">Oops! Something went wrong.</h1>
          <p className="text-gray-700 mt-4">An unexpected error occurred. We're working to fix it.</p>
          <button
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Go back Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
