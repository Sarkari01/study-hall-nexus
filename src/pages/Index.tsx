
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Always redirect to admin dashboard
  return <Navigate to="/admin" replace />;
};

export default Index;
