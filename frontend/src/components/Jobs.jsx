import React, { useMemo } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { Filter } from "lucide-react";

// Parse salary string like "0-40k", "40k-1lakh", "1lakh-5lakh", "5lakh+"
// into a [min, max] range in LPA numbers
const parseSalaryRange = (salaryStr) => {
  if (!salaryStr) return null;
  const s = salaryStr.toLowerCase().replace(/\s/g, "");
  const toNum = (v) => {
    if (v.endsWith("lakh")) return parseFloat(v);        // already in LPA
    if (v.endsWith("k"))   return parseFloat(v) / 100;   // k → LPA
    return parseFloat(v) / 100000;                        // raw → LPA
  };
  if (s.endsWith("+")) return [toNum(s.slice(0, -1)), Infinity];
  const parts = s.split("-");
  if (parts.length === 2) return [toNum(parts[0]), toNum(parts[1])];
  return null;
};

const Jobs = () => {
  const { allJobs = [], searchedQuery, filters = {} } = useSelector((store) => store.job);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  const filterJobs = useMemo(() => {
    let results = allJobs;

    // ── 1. Client-side panel filters (Location / Industry / Salary) ─────────
    const { location, industry, salary } = filters;
    const salaryRange = parseSalaryRange(salary);

    if (location || industry || salary) {
      results = results.filter((job) => {
        // Location
        if (location) {
          const jobLoc = job?.location?.toLowerCase() || "";
          if (!jobLoc.includes(location.toLowerCase())) return false;
        }
        // Industry — match title or description
        if (industry) {
          const jobTitle = job?.title?.toLowerCase() || "";
          const jobDesc  = job?.description?.toLowerCase() || "";
          if (!jobTitle.includes(industry.toLowerCase()) && !jobDesc.includes(industry.toLowerCase()))
            return false;
        }
        // Salary (job.salary stored as LPA number)
        if (salaryRange) {
          const jobSalary = Number(job?.salary) || 0;
          const [min, max] = salaryRange;
          if (jobSalary < min || jobSalary > max) return false;
        }
        return true;
      });
    }

    // ── 2. Keyword search (from HeroSection / Browse) ────────────────────────
    const q = (searchedQuery || "").toLowerCase().trim();
    if (q) {
      results = results.filter((job) =>
        [job?.title, job?.description, job?.location, job?.company?.name]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q))
      );
    }

    return results;
  }, [allJobs, filters, searchedQuery]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Available Jobs ({filterJobs.length})</h2>
          <button 
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <Filter className="h-4 w-4" />
            {isMobileFilterOpen ? "Hide Filters" : "Filters"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Filter Sidebar (Desktop mostly, toggled on Mobile) */}
          <div className={`${isMobileFilterOpen ? "block" : "hidden"} md:block w-full md:w-64 lg:w-72 flex-shrink-0 transition-all`}>
            <FilterCard />
          </div>

          {/* Job Listings Container */}
          <div className="flex-1 h-auto md:h-[88vh] overflow-y-auto pb-5 md:pr-2 no-scrollbar">
            {filterJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] md:h-full gap-3 bg-white rounded-xl border border-gray-100 p-8 text-center shadow-sm">
                <span className="text-5xl mb-2">🔍</span>
                <span className="text-2xl font-bold text-gray-800">No jobs found</span>
                <p className="text-gray-500 max-w-sm">Try adjusting your filters, location, or search query to find more opportunities.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                <AnimatePresence>
                  {filterJobs.map((job) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={job?._id}
                      className="h-full"
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
