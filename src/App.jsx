import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./Components/Admin_Segment/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect home to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin route rendering the dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
