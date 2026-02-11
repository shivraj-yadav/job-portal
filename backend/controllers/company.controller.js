import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    /* ===== Validation ===== */
    if (!companyName || !companyName.trim()) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    // Normalize company name
    const normalizedCompanyName = companyName.trim();

    /* ===== Check Authentication ===== */
    if (!req.id) {
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    /* ===== Duplicate Company Check (Case Insensitive) ===== */
    const existingCompany = await Company.findOne({
      name: { $regex: `^${normalizedCompanyName}$`, $options: "i" },
    });

    if (existingCompany) {
      return res.status(409).json({
        message: "Company already registered",
        success: false,
      });
    }

    /* ===== Create Company ===== */
    const company = await Company.create({
      name: normalizedCompanyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      success: true,
      company,
    });

  } catch (error) {
    console.error("Register Company Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;

        const companies = await Company.find({ userId });

        if (companies.length === 0) {
            return res.status(404).json({
                message: "No companies found",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });

    } catch (error) {
        console.error("Get Company Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async (req, res) => {
  try {
    const {name, description, website, location} = req.body;
    const file = req.file;

    //Cloudeinary

    const updateData = {
      name,
      description,
      website,
      location
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new: true});
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false
      })
    }
    return res.status(200).json({
      company,
      success: true
    })
  } catch (error) {
    console.error("Update Company Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}