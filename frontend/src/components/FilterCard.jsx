import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFilters } from "../redux/jobSlice";
import { X } from "lucide-react";
import { Button } from "./ui/button";

const filterData = [
  {
    filterType: "Location",
    key: "location",
    options: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"],
  },
  {
    filterType: "Industry",
    key: "industry",
    options: [
      "Frontend Developer",
      "Backend Developer",
      "FullStack Developer",
      "Data Science",
      "DevOps",
      "UI/UX Designer",
    ],
  },
  {
    filterType: "Salary",
    key: "salary",
    options: ["0-40k", "40k-1lakh", "1lakh-5lakh", "5lakh+"],
  },
];

const FilterCard = () => {
  // { location: "", industry: "", salary: "" }
  const [selected, setSelected] = useState({});
  const dispatch = useDispatch();

  const toggleFilter = (key, value) => {
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value, // toggle off if same
    }));
  };

  const clearAll = () => setSelected({});

  const hasActive = Object.values(selected).some(Boolean);

  useEffect(() => {
    dispatch(setFilters(selected));
  }, [selected]);


  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-bold text-lg text-gray-800">Filter Jobs</h1>
        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs px-2 py-1 h-auto"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>
      <hr className="mb-4 border-gray-100" />

      {/* Filter sections */}
      <div className="space-y-5">
        {filterData.map((section) => (
          <div key={section.key}>
            <h2 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">
              {section.filterType}
            </h2>
            <div className="flex flex-wrap gap-2">
              {section.options.map((option) => {
                const isActive = selected[section.key] === option;
                return (
                  <button
                    key={option}
                    onClick={() => toggleFilter(section.key, option)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150
                      ${isActive
                        ? "bg-[#6A38C2] text-white border-[#6A38C2] shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#6A38C2] hover:text-[#6A38C2]"
                      }`}
                  >
                    {option}
                    {isActive && <X className="inline ml-1 h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Active filters summary */}
      {hasActive && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Active Filters</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(selected).map(([key, val]) =>
              val ? (
                <span
                  key={key}
                  className="text-xs bg-purple-50 text-[#6A38C2] border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1"
                >
                  {val}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleFilter(key, val)}
                  />
                </span>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterCard;
