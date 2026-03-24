import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId})
            .populate("applicant")
            .populate({
                path: "job",
                populate: {
                    path: "company"
                }
            });
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // check if already accepted or rejected
        if(application.status !== 'pending') {
            return res.status(400).json({
                message:"Application status has already been updated and cannot be changed.",
                success:false
            });
        }

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        if (application.status === 'accepted') {
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #6A38C2;">Congratulations, ${application.applicant.fullname}! 🎉</h2>
                    <p style="font-size: 16px; color: #333;">
                        We are absolutely thrilled to inform you that your application for the <strong>${application.job.title}</strong> position at <strong>${application.job.company.name}</strong> has been <strong>ACCEPTED</strong>.
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        Your profile stood out to us, and we are excited about the prospect of you joining the team at ${application.job.company.name}.
                        We will be in touch very shortly to discuss the next steps in the process.
                    </p>
                    <br/>
                    <p style="font-size: 16px; color: #333;">Best regards,</p>
                    <p style="font-size: 16px; font-weight: bold; color: #6A38C2;">The Hiring Team</p>
                </div>
            `;
            await sendEmail({
                email: application.applicant.email,
                subject: `Application Accepted: ${application.job.title} at ${application.job.company.name}`,
                html: htmlContent
            });
        }

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
}