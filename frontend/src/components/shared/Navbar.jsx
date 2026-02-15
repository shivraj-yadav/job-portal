import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function Navbar() {
  // Temporary auth check
  const user = false;

  return (
    <div className="bg-white border-b">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold">
            Job<span className="text-[#F83002]">Portal</span>
          </h1>
        </div>

        <div className="flex items-center gap-8">
          {/* Nav Links */}
          <ul className="flex font-medium items-center gap-5">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
            <li>
              <Link to="/browse">Browse</Link>
            </li>
          </ul>

          {/* Conditional UI */}
          {!user ? (
            // 🔥 Login Signup Buttons
            <div className="flex gap-3">
              <Link to="/login">
                <button className="border px-4 py-1 rounded-md hover:bg-gray-100">
                  Login
                </button>
              </Link>

              <Link to="/signup">
                <button className="bg-[#F83002] text-white px-4 py-1 rounded-md hover:bg-[#d92a00]">
                  Signup
                </button>
              </Link>
            </div>
          ) : (
            // 🔥 Avatar + Popover
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-48">
                <div className="flex flex-col gap-2">
                  <Link
                    to="/profile"
                    className="hover:bg-gray-100 p-2 rounded-md"
                  >
                    Profile
                  </Link>

                  <button className="text-left hover:bg-gray-100 p-2 rounded-md text-red-500">
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
