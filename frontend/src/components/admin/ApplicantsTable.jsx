import React, { useState } from "react";
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
import { MoreHorizontal, FileText, CheckCircle, XCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "./../../utils/constant";
import { setAllApplicants } from "./../../redux/applicationSlice";
import axios from "axios";

const statusConfig = {
  accepted: { label: "Accepted", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
  pending:  { label: "Pending",  color: "bg-yellow-100 text-yellow-700" },
};

const ApplicantsTable = () => {
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  const [updatingId, setUpdatingId] = useState(null);

  const statusHandler = async (status, applicationId) => {
    setUpdatingId(applicationId);
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
        { status },
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success(`Applicant marked as ${status}`);
        // Optimistically update the status in Redux
        const updated = {
          ...applicants,
          applications: applicants.applications.map((app) =>
            app._id === applicationId ? { ...app, status: status.toLowerCase() } : app
          ),
        };
        dispatch(setAllApplicants(updated));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const applications = applicants?.applications ?? [];

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <FileText className="h-12 w-12 mb-3 opacity-40" />
        <p className="text-lg font-medium">No applicants yet</p>
        <p className="text-sm mt-1">Candidates who apply will appear here</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption className="text-gray-400 mb-2">
        All candidates who applied for this job
      </TableCaption>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="font-semibold text-gray-600">#</TableHead>
          <TableHead className="font-semibold text-gray-600">Full Name</TableHead>
          <TableHead className="font-semibold text-gray-600">Email</TableHead>
          <TableHead className="font-semibold text-gray-600">Contact</TableHead>
          <TableHead className="font-semibold text-gray-600">Resume</TableHead>
          <TableHead className="font-semibold text-gray-600">Applied On</TableHead>
          <TableHead className="font-semibold text-gray-600">Status</TableHead>
          <TableHead className="text-right font-semibold text-gray-600">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((item, index) => {
          const currentStatus = item?.status ?? "pending";
          const statusStyle = statusConfig[currentStatus] ?? statusConfig.pending;

          return (
            <TableRow key={item._id} className="hover:bg-gray-50 transition-colors">

              {/* Index */}
              <TableCell className="text-gray-400 text-sm">{index + 1}</TableCell>

              {/* Name */}
              <TableCell className="font-medium text-gray-800">
                {item?.applicant?.fullname}
              </TableCell>

              {/* Email */}
              <TableCell className="text-gray-600 text-sm">{item?.applicant?.email}</TableCell>

              {/* Contact */}
              <TableCell className="text-gray-600 text-sm">
                {item?.applicant?.phoneNumber || "—"}
              </TableCell>

              {/* Resume */}
              <TableCell>
                {item?.applicant?.profile?.resume ? (
                  <a
                    href={item.applicant.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#6A38C2] hover:underline text-sm font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    {item?.applicant?.profile?.resumeOriginalName ?? "Resume"}
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">Not uploaded</span>
                )}
              </TableCell>

              {/* Applied On */}
              <TableCell className="text-gray-500 text-sm">
                {item?.applicant?.createdAt?.split("T")[0]}
              </TableCell>

              {/* Status Badge */}
              <TableCell>
                <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle.color}`}>
                  {statusStyle.label}
                </Badge>
              </TableCell>

              {/* Action */}
              <TableCell className="text-right">
                {currentStatus === "pending" ? (
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal
                        className={`h-5 w-5 cursor-pointer ml-auto ${
                          updatingId === item._id ? "animate-pulse text-gray-300" : "text-gray-400 hover:text-gray-700"
                        }`}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-36 p-2">
                      <div
                        onClick={() => statusHandler("Accepted", item._id)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-green-50 text-sm text-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </div>
                      <div
                        onClick={() => statusHandler("Rejected", item._id)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-red-50 text-sm text-red-600 mt-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <span className="text-gray-400 text-xs italic">Reviewed</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ApplicantsTable;
