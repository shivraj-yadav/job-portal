import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "./../../utils/constant";
import { setUser } from "./../../redux/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const NavLinks = () => (
    <>
      {user && user.role === "recruiter" ? (
        <>
          <li>
            <Link to="/admin/companies" onClick={() => setIsMobileMenuOpen(false)}>Companies</Link>
          </li>
          <li>
            <Link to="/admin/jobs" onClick={() => setIsMobileMenuOpen(false)}>Jobs</Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)}>Jobs</Link>
          </li>
          <li>
            <Link to="/browse" onClick={() => setIsMobileMenuOpen(false)}>Browse</Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        <div>
          <Link to="/">
            <h1 className="text-2xl font-bold tracking-tighter">
              Job<span className="text-[#F83002]">Portal</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex font-medium items-center gap-6 text-gray-700 hover:text-gray-900">
            <NavLinks />
          </ul>
          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" className="font-semibold">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] font-semibold text-white">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-[#6A38C2] hover:ring-offset-2 transition-all">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                    alt="user profile"
                    className="object-cover"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 shadow-xl border-gray-100 rounded-xl mr-4 md:mr-0 mt-2">
                <div>
                  <div className="flex gap-4 items-center mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                        alt="user profile"
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-gray-900 truncate max-w-[180px]">{user?.fullname}</h4>
                      <p className="text-sm text-gray-500 truncate max-w-[180px]">
                        {user?.profile?.bio || "No bio available"}
                      </p>
                    </div>
                  </div>
                  <hr className="border-gray-100 mb-2" />
                  <div className="flex flex-col gap-1 text-gray-600">
                    {user?.role === "student" && (
                      <Link to="/profile" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                        <User2 className="h-4 w-4 text-gray-500 group-hover:text-[#6A38C2]" />
                        <span className="font-medium group-hover:text-gray-900">View Profile</span>
                      </Link>
                    )}

                    <div onClick={logoutHandler} className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer group mt-1">
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-red-600">Logout</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center gap-4">
          {user && (
            <Avatar className="cursor-pointer h-8 w-8" onClick={() => navigate("/profile")}>
              <AvatarImage
                src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                alt="user profile"
                className="object-cover"
              />
            </Avatar>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden min-h-screen bg-white border-t border-gray-100 px-4 pt-4 pb-6 space-y-4">
          <ul className="flex flex-col font-medium gap-4 text-gray-700">
            <NavLinks />
          </ul>
          <hr className="border-gray-100" />
          {!user ? (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full justify-center bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                onClick={() => {
                  logoutHandler();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
