import { isDatabaseReady } from "../config/db.js";
import { mockRoutines } from "../data/mockData.js";
import Routine from "../models/Routine.js";

export async function getRoutine(req, res, next) {
  try {
    const userId = req.params.userId;

    if (isDatabaseReady()) {
      const routine = await Routine.findOne({ userId });
      if (!routine) return res.status(404).json({ message: "Routine not found" });
      return res.json({ source: "mongo", routine });
    }

    const routine = mockRoutines.find((item) => item.userId === userId);
    if (!routine) return res.status(404).json({ message: "Routine not found" });
    return res.json({ source: "mock", routine });
  } catch (error) {
    return next(error);
  }
}

export async function saveRoutine(req, res, next) {
  try {
    const { userId, morning = [], night = [] } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    if (isDatabaseReady()) {
      const routine = await Routine.findOneAndUpdate(
        { userId },
        { userId, morning, night },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(200).json({ source: "mongo", routine });
    }

    const existing = mockRoutines.find((item) => item.userId === userId);
    if (existing) {
      existing.morning = morning;
      existing.night = night;
      return res.json({ source: "mock", routine: existing });
    }

    const routine = {
      _id: `rt-${Date.now()}`,
      userId,
      morning,
      night
    };
    mockRoutines.push(routine);

    return res.status(201).json({ source: "mock", routine });
  } catch (error) {
    return next(error);
  }
}
