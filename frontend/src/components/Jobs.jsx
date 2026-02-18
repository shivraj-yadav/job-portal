import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  const [filterJobs, setFilterJobs] = useState([]);

  // 🔥 Animation Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // 🔥 Filtering Logic
  useEffect(() => {
    if (!allJobs) return;

    if (searchedQuery) {
      const filtered = allJobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description
            ?.toLowerCase()
            .includes(searchedQuery.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchedQuery.toLowerCase()),
      );

      setFilterJobs(filtered);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          {/* Filter Sidebar */}
          <div className="w-1/5">
            <FilterCard />
          </div>

          {/* Job List Section */}
          {filterJobs.length === 0 ? (
            <div className="flex-1 flex justify-center items-center h-[70vh]">
              <span className="text-gray-500 text-lg">Job not found 😔</span>
            </div>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5 scroll-smooth">
              <motion.div
                className="grid grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filterJobs.map((job) => (
                  <motion.div
                    key={job?._id}
                    variants={cardVariants}
                    transition={{ duration: 0.4 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
