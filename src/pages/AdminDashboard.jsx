import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="admin-wrapper">
      
      <nav className="admin-nav">
        
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}
