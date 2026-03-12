import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, trim: true },
    skinType: { type: String, default: "" },
    skinConcerns: [{ type: String }],
    ageRange: { type: String, default: "" }
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
