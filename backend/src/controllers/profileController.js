import { isDatabaseReady } from "../config/db.js";
import { mockProfiles } from "../data/mockData.js";
import Profile from "../models/Profile.js";

export async function getProfile(req, res, next) {
  try {
    const userId = req.params.userId;

    if (isDatabaseReady()) {
      const profile = await Profile.findOne({ userId });
      if (!profile) return res.status(404).json({ message: "Profile not found" });
      return res.json({ source: "mongo", profile });
    }

    const profile = mockProfiles.find((item) => item.userId === userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    return res.json({ source: "mock", profile });
  } catch (error) {
    return next(error);
  }
}

export async function saveProfile(req, res, next) {
  try {
    const { userId, skinType = "", skinConcerns = [], ageRange = "" } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    if (isDatabaseReady()) {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { userId, skinType, skinConcerns, ageRange },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(200).json({ source: "mongo", profile });
    }

    const existing = mockProfiles.find((item) => item.userId === userId);
    if (existing) {
      existing.skinType = skinType;
      existing.skinConcerns = skinConcerns;
      existing.ageRange = ageRange;
      return res.status(200).json({ source: "mock", profile: existing });
    }

    const profile = {
      _id: `pf-${Date.now()}`,
      userId,
      skinType,
      skinConcerns,
      ageRange
    };
    mockProfiles.push(profile);

    return res.status(201).json({ source: "mock", profile });
  } catch (error) {
    return next(error);
  }
}
