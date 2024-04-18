import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

const ViewCourse = () => {
  const [reviewModal,setReviewModal] = useState(null);
  const {courseId} = useParams()
  const {token} = useSelector((state)=>state.auth)
  const dispatch = useDispatch()

  useEffect(()=>{
    ;(async ()=>{
      const result = await getFullDetailsOfCourse(courseId,token)
      console.log("FULL COURSE RESULT : ",result)
      dispatch(setEntireCourseData(result?.courseDetails));
      dispatch(setCourseSectionData(result?.courseDetails?.courseContent))
      dispatch(setCompletedLectures(result?.completedVideos))
      let lectures =0;
      result?.courseDetails?.courseContent?.forEach((sec)=>{
        lectures += sec?.subSections?.length;
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
  },[])
  return (
    <>
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <VideoDetailsSidebar setReviewModal={setReviewModal} />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-6">
          <Outlet />
        </div>
      </div>
    </div>
    {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
  </>
  )
}

export default ViewCourse