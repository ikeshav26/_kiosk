import Schedule from '../models/Schedule.model.js';
import cloudinary from '../config/Cloudinary.js';

const normalizeDepartmentName = (value) => {
  const key = (value || '').toString().trim().toUpperCase();

  const map = {
    CSE: 'CSE',
    CIVIL: 'CIVIL',
    'CIVIL ENGINEERING': 'CIVIL',
    MECH: 'MECH',
    'MECHANICAL ENGINEERING': 'MECH',
    AIML: 'AIML',
    IOT: 'IOT',
    IOTS: 'IOT',
    'AIML/IOT': 'AIML',
    IT: 'CSE',
    ECE: 'ELECTRICAL',
    EEE: 'ELECTRICAL',
    ELECTRICAL: 'ELECTRICAL',
    'ELECTRICAL ENGINEERING': 'ELECTRICAL',
    'ELECTRONICS AND COMMUNICATION ENGINEERING': 'ELECTRICAL',
  };

  return map[key] || 'CSE';
};

export const addSchedule = async (req, res) => {
  try {
    const { departmentName, semester, sectionName, scheduleLink } = req.body;

    const cloudinaryRes = await cloudinary.uploader.upload(scheduleLink, {
      resource_type: 'raw',
      folder: 'schedules',
    });
    const schedule = new Schedule({
      departmentName: normalizeDepartmentName(departmentName),
      semester,
      sectionName,
      scheduleLink: cloudinaryRes.secure_url,
    });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);
    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().lean();
    const normalized = schedules.map((s) => ({
      ...s,
      departmentName: normalizeDepartmentName(s.departmentName),
    }));
    res.status(200).json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { id: scheduleId } = req.params;
    const { departmentName, semester, sectionName } = req.body;
    let { scheduleLink } = req.body;

    if (scheduleLink) {
      const cloudinaryRes = await cloudinary.uploader.upload(scheduleLink, {
        resource_type: 'raw',
        folder: 'schedules',
      });
      scheduleLink = cloudinaryRes.secure_url;
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      {
        departmentName: normalizeDepartmentName(departmentName),
        semester,
        sectionName,
        scheduleLink,
      },
      { new: true }
    );
    res.status(200).json(updatedSchedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSchedule = await Schedule.findByIdAndDelete(id);
    res.status(200).json(deletedSchedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};
