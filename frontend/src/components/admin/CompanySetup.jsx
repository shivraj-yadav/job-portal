import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Building2, MapPin, Globe, FileText, UploadCloud } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "./../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux"; 
import useGetCompanyById from "../../components/hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true); 
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: singleCompany.file || null,
      });
    }
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="max-w-3xl mx-auto my-6 md:my-10 px-4 md:px-0">
        
        {/* Back Button */}
        <Button
          type="button"
          onClick={() => navigate("/admin/companies")}
          variant="ghost"
          className="flex items-center gap-2 text-gray-500 font-semibold mb-6 hover:bg-gray-100 hover:text-gray-900 border-none shadow-none pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Companies</span>
        </Button>

        <form onSubmit={submitHandler} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-10 transition-all duration-300">
          
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg ring-4 ring-indigo-50">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">Company Profile</h1>
              <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">Update your company details and visual identity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Company Name</Label>
              <div className="relative group">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  className="pl-11 py-6 focus:ring-2 focus:ring-indigo-500 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all text-base"
                  placeholder="e.g. Acme Corporation"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Headquarters</Label>
              <div className="relative group">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="pl-11 py-6 focus:ring-2 focus:ring-purple-500 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all text-base"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2 md:col-span-2">
              <Label className="font-bold text-gray-700">Website URL</Label>
              <div className="relative group">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  type="url"
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  className="pl-11 py-6 focus:ring-2 focus:ring-blue-500 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all text-base"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label className="font-bold text-gray-700">Company Description</Label>
              <div className="relative group">
                <FileText className="absolute left-3.5 top-4 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <textarea
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  rows={4}
                  className="w-full pl-11 pr-4 py-4 text-base border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 focus:bg-white transition-all"
                  placeholder="Briefly describe what your company does and its mission..."
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2 md:col-span-2">
              <Label className="font-bold text-gray-700">Company Logo</Label>
              <div className="mt-2 flex justify-center px-6 pt-8 pb-10 border-2 border-gray-200 border-dashed rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors group relative overflow-hidden bg-gray-50/50">
                <div className="space-y-2 text-center relative z-10">
                  <div className="mx-auto w-16 h-16 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="h-8 w-8 text-indigo-500" />
                  </div>
                  <div className="flex text-sm text-gray-600 justify-center items-center gap-1">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white px-4 py-2 rounded-lg font-semibold text-indigo-600 border border-indigo-100 hover:bg-indigo-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 transition-all shadow-sm"
                    >
                      <span>Choose file</span>
                      <Input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={changeFileHandler}
                      />
                    </label>
                    <p className="pl-2 text-gray-500 font-medium hidden sm:block">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400 font-medium pt-2">PNG, JPG, SVG up to 5MB</p>
                  {input.file && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 inline-block animate-in fade-in zoom-in duration-300">
                      <p className="text-sm font-semibold text-green-700 text-center truncate max-w-[200px]">
                        ✓ {input.file.name}
                      </p>
                    </div>
                  )}
                </div>
                {/* Decorative background blob */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100/40 rounded-full blur-3xl group-hover:bg-indigo-200/50 transition-colors z-0" />
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            {loading ? (
              <Button disabled className="w-full py-6 rounded-xl text-lg font-bold bg-indigo-500 text-white shadow-lg flex items-center justify-center">
                <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Saving Changes...
              </Button>
            ) : (
              <Button type="submit" className="w-full py-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:ring-4 focus:ring-indigo-500/30">
                Save Company Details
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
