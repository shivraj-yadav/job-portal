import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "./../../utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "./../../redux/companySlice";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState();
  const dispatch = useDispatch();
  const registerNewCompany = async () => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        <div className="my-6 md:my-10">
          <h1 className="font-bold text-xl md:text-2xl">Your Company Name</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1 mt-md-0">
            What would you like to give your company name? you can change this
            later.
          </p>
        </div>

        <Label className="text-sm md:text-base font-medium">Company Name</Label>
        <Input
          type="text"
          className="my-2"
          placeholder="JobHunt, Microsoft etc."
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <div className="flex items-center gap-2 my-8 md:my-10">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/companies")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={registerNewCompany} className="w-full sm:w-auto">Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
