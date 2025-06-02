import React, { lazy, Suspense } from "react";
import Home from "./components/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./components/login";
import ShowProperty from "./components/showProperty.jsx";

const AdminDashboard = lazy(() => import("./components/adminDashboard.jsx"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen bg-[#ccc]">
                  <div className="loader w-12 h-12 border-t-transparent"></div>
                </div>
              }
            >
              <LogIn />
            </Suspense>
          }
        />
        <Route
          path="/admin/home"
          element={
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen bg-[#ccc]">
                  <div className="loader w-12 h-12 border-t-transparent"></div>
                </div>
              }
            >
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="/show/:id"
          element={
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen bg-[#ccc]">
                  <div className="loader w-12 h-12 border-t-transparent"></div>
                </div>
              }
            >
              <ShowProperty />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
