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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import { setCompanies } from "../../redux/companySlice";

const CompaniesTable = () => {
  const dispatch = useDispatch();
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company,
  );
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchCompanyByText) {
          return true;
        }
        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  const deleteCompanyHandler = async (companyId) => {
    try {
      const res = await axios.delete(`${COMPANY_API_END_POINT}/${companyId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        // Optimistically update Redux store
        const updatedCompanies = companies.filter((c) => c._id !== companyId);
        dispatch(setCompanies(updatedCompanies));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete company");
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 overflow-x-auto shadow-sm">
      <Table className="min-w-full w-full">
        <TableCaption className="mb-3 text-gray-400">A list of your recent registered companies</TableCaption>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-600">Logo</TableHead>
            <TableHead className="font-semibold text-gray-600">Name</TableHead>
            <TableHead className="font-semibold text-gray-600">Date</TableHead>
            <TableHead className="text-right font-semibold text-gray-600">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany?.length === 0 ? (
             <TableRow>
               <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                 No companies found. Register a new company to get started.
               </TableCell>
             </TableRow>
          ) : (
             filterCompany?.map((company) => (
            <TableRow key={company._id} className="hover:bg-gray-50 transition-colors">
              <TableCell>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={company.logo} className="object-cover" />
                </Avatar>
              </TableCell>
              <TableCell className="font-medium text-gray-800">{company.name}</TableCell>
              <TableCell className="text-gray-500 text-sm whitespace-nowrap">{company.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="h-5 w-5 text-gray-400 hover:text-gray-700 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2">
                    <div
                      onClick={() =>
                        navigate(`/admin/companies/${company._id}`)
                      }
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-sm"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() => deleteCompanyHandler(company._id)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-red-50 text-sm text-red-600 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          )))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
