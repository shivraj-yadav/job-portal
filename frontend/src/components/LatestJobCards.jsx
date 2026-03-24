import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { Button } from "./ui/button";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-6 rounded-2xl shadow-sm bg-white border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 relative group"
    >
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#7209b7] rounded-full" onClick={(e) => { e.stopPropagation(); }}>
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {/* Placeholder for small company logo similar to Job.jsx */}
        <div className="h-12 w-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center p-1.5 flex-shrink-0">
          {job?.company?.logo ? (
            <img src={job.company.logo} alt="🏢" className="w-full h-full object-contain" />
          ) : (
            <span className="text-xl font-bold text-indigo-300">{job?.company?.name?.[0]?.toUpperCase() || '🏢'}</span>
          )}
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-900 group-hover:text-[#7209b7] transition-colors">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500 font-medium">{job?.location || 'India'}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-50 pt-4">
        <h1 className="font-extrabold text-xl mb-2 text-gray-900 line-clamp-1">{job?.title}</h1>
        <p className="text-sm text-gray-500 leading-relaxed font-medium line-clamp-2">{job?.description}</p>
      </div>

      <div className="flex items-center gap-2 mt-6 flex-wrap">
        <Badge className={"bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium px-3 py-1 border-none"} variant="secondary">
          {job?.position} Positions
        </Badge>
        <Badge className={"bg-red-50 text-[#F83002] hover:bg-red-100 font-medium px-3 py-1 border-none"} variant="secondary">
          {job?.jobType}
        </Badge>
        <Badge className={"bg-purple-50 text-[#7209b7] hover:bg-purple-100 font-medium px-3 py-1 border-none"} variant="secondary">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
