import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "./../../utils/constant";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "./../../redux/applicationSlice";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applicants } = useSelector((store) => store.application);
  const count = applicants?.applications?.length ?? 0;

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true },
        );
        dispatch(setAllApplicants(res.data.job));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllApplicants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto my-10 px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] rounded-xl shadow">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Applicants</h1>
              <p className="text-sm text-gray-500">
                {count === 0
                  ? "No candidates have applied yet"
                  : `${count} candidate${count > 1 ? "s" : ""} applied for this role`}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/jobs")}
            className="flex items-center gap-2 text-gray-600 border-gray-200 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <ApplicantsTable />
        </div>
      </div>
    </div>
  );
};

export default Applicants;
