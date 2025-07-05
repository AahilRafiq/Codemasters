import React from "react";
import CodeEditor from "@/pages/CodeEditor";
import {Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Navbar from "@/components/Navbar";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import NewQuestion from "./pages/NewQuestion";
import { Toaster } from "@/components/ui/toaster"

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/question/:id" element={<CodeEditor />} />
        <Route path="/questions/new" element={<NewQuestion />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/signin" element={<Login />} />
      </Routes>    
    </>
  );
};

export default App;
