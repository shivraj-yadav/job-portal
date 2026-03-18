import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "./../../utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, Briefcase } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value,
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.companyId) {
      return toast.error("Please select a company before posting a job.");
    }

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto my-10 px-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-[#F83002] to-[#f97316] rounded-xl shadow">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Post a New Job</h1>
            <p className="text-sm text-gray-500">Fill in the details to publish a job opening</p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-semibold text-gray-700">Job Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                placeholder="e.g. Frontend Developer"
                className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2]"
              />
            </div>

            {/* Job Type */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-semibold text-gray-700">Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                placeholder="e.g. Full-time, Part-time, Remote"
                className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2]"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-semibold text-gray-700">Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="e.g. Bangalore, Remote"
                className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2]"
              />
            </div>

            {/* Salary */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-semibold text-gray-700">Salary (LPA)</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                placeholder="e.g. 12"
                className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2]"
              />
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-semibold text-gray-700">Experience Level (yrs)</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                placeholder="e.g. 2"
                className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2]"
              />
            </div>

            {/* Number of Positions */}
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-semibold text-gray-700">No. of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                min={1}
                className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2]"
              />
            </div>

            {/* Requirements — full width */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <Label className="text-sm font-semibold text-gray-700">
                Requirements
                <span className="ml-1 text-xs font-normal text-gray-400">(comma separated)</span>
              </Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="e.g. React, Node.js, MongoDB"
                className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2]"
              />
            </div>

            {/* Description — full width */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <Label className="text-sm font-semibold text-gray-700">Job Description</Label>
              <textarea
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Describe the role, responsibilities and what you're looking for..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent transition"
              />
            </div>

            {/* Company Select — full width */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <Label className="text-sm font-semibold text-gray-700">Select Company</Label>
              {companies.length > 0 ? (
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2]">
                    <SelectValue placeholder="Choose a company for this job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-sm text-red-600 font-medium">
                    ⚠️ No companies registered yet. Please{" "}
                    <span
                      className="underline cursor-pointer"
                      onClick={() => navigate("/admin/companies/create")}
                    >
                      register a company
                    </span>{" "}
                    first.
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Submit */}
          <div className="mt-8">
            {loading ? (
              <Button disabled className="w-full py-3 rounded-xl text-base font-semibold">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Publishing...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-[#F83002] to-[#f97316] hover:from-[#d42700] hover:to-[#ea6c00] text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
              >
                Publish Job
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
