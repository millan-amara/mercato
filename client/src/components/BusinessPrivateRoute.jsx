import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuthStatus from "../hooks/useAuthStatus";
import { toast } from "react-toastify";

const BusinessPrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const userState = useSelector((state) => state.auth); // Access the correct state
  const user = userState.user; // Get the actual user object

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!checkingStatus) {
      if (!loggedIn) {
        setErrorMessage("You need to log in to access this page.");
      } else if (!user?.business) {
        setErrorMessage("You do not have access to this page.");
      } else {
        setErrorMessage(""); // Clear error if user is logged in and a business
      }
    }
  }, [loggedIn, user, checkingStatus]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  if (checkingStatus || !user) {
    return <h1>Loading...</h1>; // Wait until we have user data
  }

  if (!loggedIn) {
    return <Navigate to="/landing" />;
  }

  if (!user.business) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default BusinessPrivateRoute;
