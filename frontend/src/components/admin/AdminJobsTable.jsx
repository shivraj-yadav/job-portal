import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <Table>
        <TableCaption className="mb-3 text-gray-400">
          A list of all jobs you have posted
        </TableCaption>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-600">Company</TableHead>
            <TableHead className="font-semibold text-gray-600">Role</TableHead>
            <TableHead className="font-semibold text-gray-600">Posted On</TableHead>
            <TableHead className="font-semibold text-gray-600 text-center">
              <div className="flex items-center justify-center gap-1">
                <Users className="h-4 w-4" />
                Applicants
              </div>
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-600">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                No jobs found. Post a new job to get started.
              </TableCell>
            </TableRow>
          ) : (
            filterJobs?.map((job) => (
              <TableRow key={job._id} className="hover:bg-gray-50 transition-colors">
                {/* Company */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {job?.company?.logo && (
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="h-7 w-7 rounded-full object-cover border"
                      />
                    )}
                    <span className="font-medium text-gray-800">{job?.company?.name}</span>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <span className="font-medium text-gray-700">{job?.title}</span>
                </TableCell>

                {/* Date */}
                <TableCell className="text-gray-500 text-sm">
                  {job?.createdAt?.split("T")[0]}
                </TableCell>

                {/* Applicants count */}
                <TableCell className="text-center">
                  <Badge
                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                    className={`cursor-pointer text-sm px-3 py-1 rounded-full font-semibold transition-all hover:scale-105
                      ${job?.applications?.length > 0
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                  >
                    {job?.applications?.length ?? 0}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal className="h-5 w-5 text-gray-400 hover:text-gray-700 cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-36 p-2">
                      <div
                        onClick={() => navigate(`/admin/companies/${job._id}`)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-sm"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                        <span>Edit Job</span>
                      </div>
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-sm mt-1"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span>View Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
