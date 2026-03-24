import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "./../utils/constant";
import { setSingleJob } from "./../redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { MapPin, Briefcase, IndianRupee, Users, CalendarDays, FileText } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application?.applicant === user?._id || application === user?._id,
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    // ── Profile Completeness Verification ──
    const p = user?.profile;
    const isProfileComplete =
      user?.fullname &&
      user?.email &&
      user?.phoneNumber &&
      p?.bio?.trim() &&
      p?.skills?.length > 0 &&
      p?.resume;

    if (!isProfileComplete) {
      return toast.error("Please complete your profile (bio, skills, resume, etc.) in the Profile section before applying.");
    }

    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true },
      );

      if (res.data.success) {
        setIsApplied(true); // Update the local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application?.applicant === user?._id || application === user?._id,
            ),
          ); // Ensure the state is in sync with fetched data
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Company Logo placeholder if no logo available */}
            <div className="h-20 w-20 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-2 flex-shrink-0 relative overflow-hidden group">
              {singleJob?.company?.logo ? (
                <img src={singleJob.company.logo} alt={singleJob?.company?.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <span className="text-4xl font-extrabold text-indigo-100">{singleJob?.company?.name?.[0]?.toUpperCase() || '🏢'}</span>
              )}
            </div>
            
            <div>
              <h1 className="font-bold text-2xl md:text-3xl text-gray-900 leading-tight">
                {singleJob?.title}
              </h1>
              <p className="text-lg text-gray-500 font-medium mt-1">
                {singleJob?.company?.name}
              </p>
              
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <Badge className={"bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium px-3 py-1 border-none shadow-sm"} variant="secondary">
                  {singleJob?.position} Position{singleJob?.position !== 1 ? 's' : ''}
                </Badge>
                <Badge className={"bg-red-50 text-[#F83002] hover:bg-red-100 font-medium px-3 py-1 border-none shadow-sm"} variant="secondary">
                  {singleJob?.jobType}
                </Badge>
                <Badge className={"bg-purple-50 text-[#7209b7] hover:bg-purple-100 font-medium px-3 py-1 border-none shadow-sm"} variant="secondary">
                  {singleJob?.salary} LPA
                </Badge>
              </div>
            </div>
          </div>
          
          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-xl px-8 py-6 shadow-md transition-all sm:w-auto w-full font-semibold text-md ${
              isApplied 
                ? "bg-gray-100 text-gray-500 cursor-not-allowed shadow-none border border-gray-200" 
                : "bg-gradient-to-r from-[#7209b7] to-[#43147e] hover:shadow-lg hover:scale-[1.02] text-white"
            }`}
          >
            {isApplied ? "Already Applied" : "Submit Application"}
          </Button>
        </div>
      </div>

      {/* Details Grid & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <FileText className="w-5 h-5 text-indigo-500" />
              Job Description
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">
              {singleJob?.description}
            </div>
            
            {/* Requirements Section if array exists and has items */}
            {singleJob?.requirements && singleJob.requirements.length > 0 && singleJob.requirements[0] !== "" && (
              <div className="mt-8 pt-6 border-t border-gray-100">
               <h3 className="text-lg font-bold text-gray-900 mb-4">Requirements & Skills</h3>
               <div className="flex flex-wrap gap-2">
                 {singleJob.requirements.map((req, i) => (
                   <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                     {req.trim()}
                   </span>
                 ))}
               </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Job Overview</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-gray-900 font-medium mt-0.5">{singleJob?.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Experience</p>
                  <p className="text-gray-900 font-medium mt-0.5">{singleJob?.experienceLevel} Years</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Salary</p>
                  <p className="text-gray-900 font-medium mt-0.5">{singleJob?.salary} LPA</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Applicants</p>
                  <p className="text-gray-900 font-medium mt-0.5">{singleJob?.applications?.length || 0} Applied</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Posted On</p>
                  <p className="text-gray-900 font-medium mt-0.5">{singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
