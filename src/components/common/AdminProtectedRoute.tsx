import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

function AdminProtectedRoute() {
  const { state } = useApp();
  const location = useLocation();

  // If the user is not logged in or is not an admin, redirect them.
  if (!state.user || state.user.role !== 'admin') {
    // Redirect non-admins to the main dashboard.
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // If the user is an admin, render the child route's element.
  return <Outlet />;
}

export default AdminProtectedRoute;