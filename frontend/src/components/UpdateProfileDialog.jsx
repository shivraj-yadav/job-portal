import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "./../utils/constant";
import { setUser } from "./../redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.map((skill) => skill) || "",
    file: user?.profile?.resume || "",
  });
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
    setOpen(false);
    console.log(input);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[425px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl"
          onInteractOutside={() => setOpen(false)}
        >
          <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">Update Profile</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Make changes to your personal information here.</p>
            </div>
          </div>
          
          <form onSubmit={submitHandler} className="px-6 py-2">
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</Label>
                <Input
                  id="name"
                  name="fullname"
                  type="text"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2] bg-white transition-all py-5"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2] bg-white transition-all py-5"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="number" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                <Input
                  id="number"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2] bg-white transition-all py-5"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  rows={3}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent transition bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="skills" className="text-sm font-semibold text-gray-700">
                  Skills <span className="text-xs font-normal text-gray-400">(comma separated)</span>
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  placeholder="React, Node.js, MongoDB"
                  className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#6A38C2] bg-white transition-all py-5"
                />
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <Label htmlFor="file" className="text-sm font-semibold text-gray-700">Resume Upload</Label>
                <div className="flex items-center gap-3">
                  <Label
                    htmlFor="file"
                    className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-sm"
                  >
                    Choose File
                  </Label>
                  <span className="text-sm text-gray-500 truncate max-w-[200px]">
                    {input.file ? input.file.name : "No file chosen"}
                  </span>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf"
                    onChange={fileChangeHandler}
                    className="hidden"
                  />
                </div>
              </div>

            </div>
            
            <DialogFooter className="pt-4 pb-2 sm:justify-end border-t border-gray-100 mt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="mr-2 hidden sm:inline-flex">
                Cancel
              </Button>
              {loading ? (
                <Button disabled className="w-full sm:w-auto px-8 rounded-xl bg-[#6A38C2] opacity-80">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </Button>
              ) : (
                <Button type="submit" className="w-full sm:w-auto px-8 rounded-xl bg-[#6A38C2] hover:bg-[#5b30a6] text-white shadow-md hover:shadow-lg transition-all">
                  Update Profile
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfileDialog;
