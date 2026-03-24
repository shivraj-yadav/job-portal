import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto my-16 md:my-24 px-4 sm:px-6 lg:px-8">
      {/* Sleek Gradient Header */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7209b7] to-[#43147e]">Latest & Top</span> Job Openings
        </h1>
        <p className="mt-4 text-lg text-gray-500 font-medium">
          Explore the most recent opportunities tailored perfectly for your skillset.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allJobs.length <= 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 py-20 bg-gray-50 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-5xl mb-4">💼</span>
            <span className="text-xl font-bold text-gray-600">No Jobs Available Currently</span>
            <p className="text-gray-400 mt-2">Check back soon for new opportunities!</p>
          </div>
        ) : (
          allJobs
            ?.slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
