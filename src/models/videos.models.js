import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videosSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

videosSchema.plugin(mongooseAggregatePaginate); //Now you can write queries (not insertone , insertmany) but also the  aggregation queries this is mongoose aggreation pipeline

const Videos = mongoose.model("Videos", videosSchema);
export default Videos;
