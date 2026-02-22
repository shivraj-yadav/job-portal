import React, { useMemo } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Jobs = () => {
  // 1. Extract data from Redux
  const { allJobs = [], searchedQuery } = useSelector((store) => store.job);

  // 2. Derive filterJobs directly from allJobs and searchedQuery
  // useMemo ensures this only recalculates when allJobs or searchedQuery changes
  const filterJobs = useMemo(() => {
    if (!searchedQuery || searchedQuery.trim() === "") {
      return allJobs;
    }

    const query = searchedQuery.toLowerCase().trim();

    return allJobs.filter((job) => {
      const title = job?.title?.toLowerCase() || "";
      const description = job?.description?.toLowerCase() || "";
      const location = job?.location?.toLowerCase() || "";

      return (
        title.includes(query) ||
        description.includes(query) ||
        location.includes(query)
      );
    });
  }, [allJobs, searchedQuery]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Filter Section */}
          <div className="w-full md:w-1/4">
            <FilterCard />
          </div>

          {/* Job Listings Section */}
          <div className="flex-1 h-[88vh] overflow-y-auto pb-5 no-scrollbar">
            {filterJobs.length <= 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-xl font-semibold text-gray-600">
                  No jobs found matching your criteria.
                </span>
                <p className="text-gray-400">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filterJobs.map((job) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
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
