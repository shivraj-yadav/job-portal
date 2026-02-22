import { setSingleCompany } from "./../../redux/companySlice";
import { COMPANY_API_END_POINT } from "./../../utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      // 1. Guard Clause: Stop if companyId is null/undefined to avoid 404
      if (!companyId || companyId === "undefined") {
        console.warn("useGetCompanyById: No companyId provided yet.");
        return;
      }

      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/${companyId}`, // Removed "/get"
          { withCredentials: true },
        );
        if (res.data.success) {
          // 2. Update Redux store with the fetched company
          dispatch(setSingleCompany(res.data.company));
          console.log("Company data fetched successfully:", res.data.company);
        }
      } catch (error) {
        // 3. Detailed error logging
        if (error.response?.status === 404) {
          console.error("Error 404: Company route not found or ID is invalid.");
        } else {
          console.error("Axios Error in useGetCompanyById:", error.message);
        }
      }
    };

    fetchSingleCompany();
  }, [companyId, dispatch]); // Re-run if ID changes
};

export default useGetCompanyById;
