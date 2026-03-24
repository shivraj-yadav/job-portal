import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "../redux/jobSlice";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer",
  "UI/UX Designer",
  "DevOps Engineer"
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/jobs");
  };

  return (
    <div className="px-10 md:px-0 py-8">
      <Carousel className="w-full max-w-4xl mx-auto my-10">
        <CarouselContent className="-ml-2 md:-ml-4">
          {category.map((cat) => (
            <CarouselItem key={cat} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Button
                onClick={() => searchJobHandler(cat)}
                variant="outline"
                className="rounded-full w-full py-6 text-sm md:text-base font-semibold whitespace-nowrap bg-white border-2 border-indigo-50 text-indigo-900 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-700 transition-all shadow-sm hover:shadow"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="bg-white border-2 border-gray-100 hover:bg-gray-50 text-[#7209b7] h-10 w-10 shadow-sm" />
          <CarouselNext className="bg-white border-2 border-gray-100 hover:bg-gray-50 text-[#7209b7] h-10 w-10 shadow-sm" />
        </div>
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
