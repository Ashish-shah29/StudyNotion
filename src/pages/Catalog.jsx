import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import toast from "react-hot-toast";
import { getCatalogPageData } from "../services/operations/PageAndComponentData";
import Spinner from "../components/common/Spinner";
import Course_Card from "../components/core/Catalog/Course_Card";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import Error from '../components/common/Error'

const Catalog = () => {
  const {catalogName} = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [active, setActive] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await apiConnector("GET", categories.CATEGORIES_API);
        console.log("ALL CATEGORIES RESPOSE : ",response)
        if (response) {
          const category_id = response?.data?.data?.filter(
            (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
          )[0]._id;
          setCategoryId(category_id);
        }
      } catch (err) {
        console.log("ALL CATEGORIES API ERROR...", err);
      }
    };
    getCategories();
  }, [catalogName]);
  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        console.log("Category Id : ",categoryId)
        const response = await getCatalogPageData(categoryId);
        if (response?.success) {
          console.log("RESPONSE DATA : ",response?.data)
          setCatalogPageData(response?.data);
        }
      } catch (err) {
        console.log("Could not get catalog page Details ", err);
      }
    };
    if (categoryId) {
      getCategoryDetails();
    }
  }, [categoryId]);

  if (loading || !catalogPageData) {
    return <Spinner />;
  }
  if (loading) {
    return <Error />
  }

  return (
    <div>
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Populer
              </p>
              <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)} 
              >
                New
              </p>
            </div>
            <div>
              <CourseSlider
                Courses={catalogPageData?.selectedCategory?.course}
              />
            </div>
          </div>

      {/* section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <p  className="section_heading">Top Courses in {catalogPageData?.differentCategory?.name}</p>
        <div className="py-8">
        <CourseSlider Courses={catalogPageData?.differentCategory?.course} />
        </div>
      </div>

      {/* section 3  */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent" >
        <p className="section_heading">Frequently bought</p>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {
          catalogPageData?.bestSellers?.slice(0,4)
          .map((course, index) => (
          <Course_Card course={course} key={index} Height={"h-[400px]"} />
        ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Catalog;
