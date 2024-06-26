const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  courseName:{
    type:String,
    trim:true,
    required:true
  },
  courseDescription:{
    type:String,
    trim:true, 
    required:true
  },
  instructor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  whatYouWillLearn:{
    type:String
  },
  price:{
    type:Number,
  },
  ratingAndReview:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"RatingAndReview",
    }
  ],
  thumbnail:{
    type:String,
  },
  courseContent:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Section",
    }
  ],
  studentsEnrolled:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    }
  ],
  category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category",
  },
  tags:{
    type:[String], 
    required:true 
  },
  status:{
    type:String,
    enum:["Draft","Published"]
  },
  instructions:{
    type:[String]
  },
  createdAt:{
    type:Date,
    default:Date.now()
  }
})

module.exports = mongoose.model("Course",courseSchema)