import React, { useMemo } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Filter Sidebar */}
          <div className="w-full md:w-72 flex-shrink-0">
            <FilterCard />
          </div>

          {/* Job Listings */}
          <div className="flex-1 h-[88vh] overflow-y-auto pb-5 no-scrollbar">
            {filterJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <span className="text-4xl">🔍</span>
                <span className="text-xl font-semibold text-gray-600">No jobs found</span>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filterJobs.map((job) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={job?._id}
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
