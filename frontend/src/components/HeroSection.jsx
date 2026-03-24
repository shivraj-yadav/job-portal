import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/jobs");
  };
  return (
    <div className="relative overflow-hidden bg-gray-50">
      {/* Decorative gradient background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-50 via-purple-50/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#7209b7] rounded-full mix-blend-multiply filter blur-3xl opacity-[0.05] pointer-events-none" />
      <div className="absolute top-24 -left-24 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-[0.05] pointer-events-none" />

      <div className="relative text-center px-4 py-16 md:py-24">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
            Search, Apply & <br className="hidden sm:block" /> Get Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7209b7] to-[#43147e] drop-shadow-sm">
              Dream Jobs
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-medium leading-relaxed">
            Discover thousands of job opportunities from top companies. Your next career move starts perfectly here!
          </p>

          {/* Search Bar */}
          <div className="flex w-full max-w-2xl mx-auto mt-4 bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl focus-within:shadow-2xl focus-within:ring-4 focus-within:ring-[#7209b7]/20 border border-gray-100 rounded-full items-center justify-between p-2 transition-all duration-300">
            <input
              type="text"
              placeholder="Find your dream jobs by title, skill, or location..."
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none border-none w-full text-base sm:text-lg bg-transparent text-gray-800 placeholder-gray-400 pl-6 py-3 font-medium"
              onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
            />
            <Button
              onClick={searchJobHandler}
              className="rounded-full bg-gradient-to-r from-[#7209b7] to-[#43147e] hover:opacity-90 h-12 w-12 sm:h-14 sm:w-14 p-0 flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md"
              aria-label="Search jobs"
            >
              <Search className="h-6 w-6 text-white" strokeWidth={2.5} />
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
            <span className="font-medium mr-2">Popular:</span>
            {["Frontend", "Backend", "Data Science", "Marketing"].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-[#7209b7] cursor-pointer transition-colors" onClick={() => { setQuery(tag); dispatch(setSearchedQuery(tag)); navigate("/jobs"); }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HeroSection;