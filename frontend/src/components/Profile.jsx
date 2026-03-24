import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "./hooks/useGetAppliedJobs";

// const skills = ["Html", "Css", "Javascript", "Reactjs"]

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const isResume = !!user?.profile?.resume;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-5 md:p-8 mx-4 sm:mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarImage
                src={user?.profile?.profilePhoto}
                alt="profile"
                className="object-cover"
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1 line-clamp-2 md:line-clamp-none">
                {user?.profile?.bio}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="self-start sm:self-auto"
            variant="outline"
            size="icon"
          >
            <Pen className="h-4 w-4" />
          </Button>
        </div>
        <div className="my-6 space-y-3">
          <div className="flex items-center gap-3 text-gray-700 break-all">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm md:text-base">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Contact className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm md:text-base">{user?.phoneNumber}</span>
          </div>
        </div>
        <div className="my-5">
          <h1 className="font-bold text-gray-800 mb-2">Skills</h1>
          <div className="flex items-center gap-2 flex-wrap">
            {user?.profile?.skills.length !== 0 ? (
              user?.profile?.skills.map((item, index) => (
                <Badge key={index} className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-none">{item}</Badge>
              ))
            ) : (
              <span className="text-gray-500 text-sm">NA</span>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
          <Label className="text-md font-bold text-gray-800">Resume</Label>
          {isResume ? (
            <a
              target="blank"
              href={user?.profile?.resume}
              className="text-blue-500 w-full hover:underline cursor-pointer truncate"
            >
              {user?.profile?.resumeOriginalName}
            </a>
          ) : (
            <span className="text-gray-500 text-sm">NA</span>
          )}
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl px-4 sm:px-0 mb-10">
        <h1 className="font-bold text-lg my-5 text-gray-800">Applied Jobs</h1>
        {/* Applied Job Table   */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 pb-2">
          <AppliedJobTable />
        </div>
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
