import cloudinary from '../config/Cloudinary.js';
import Faculty from '../models/Faculty.model.js';
import { translateText } from '../utils/translate.js';
import xlsx from 'xlsx';

const normalizeDepartment = (value) => {
  const raw = (value || '').toString().trim();
  const key = raw.toUpperCase();

  const map = {
    CSE: 'CSE',
    'COMPUTER SCIENCE': 'CSE',
    'COMPUTER SCIENCE ENGINEERING': 'CSE',
    ECE: 'ELECTRICAL',
    ELECTRONICS: 'ELECTRICAL',
    'ELECTRONICS AND COMMUNICATION ENGINEERING': 'ELECTRICAL',
    MECH: 'MECH',
    MECHANICAL: 'MECH',
    'MECHANICAL ENGINEERING': 'MECH',
    CIVIL: 'CIVIL',
    'CIVIL ENGINEERING': 'CIVIL',
    EEE: 'ELECTRICAL',
    ELECTRICAL: 'ELECTRICAL',
    'ELECTRICAL AND ELECTRONICS ENGINEERING': 'ELECTRICAL',
    IT: 'CSE',
    IOT: 'CSE',
    AIML: 'CSE',
    'AIML/IOT': 'CSE',
    'INFORMATION TECHNOLOGY': 'CSE',
    'ARTIFICIAL INTELLIGENCE': 'CSE',
    'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'CSE',
  };

  return map[key] || 'CSE';
};

const getDepartmentFilterValues = (value) => {
  const normalized = normalizeDepartment(value);
  const aliases = {
    CSE: ['CSE', 'AIML/IOT', 'AIML', 'IOT', 'IT'],
    CIVIL: ['CIVIL'],
    MECH: ['MECH'],
    ELECTRICAL: ['ELECTRICAL', 'ECE', 'EEE'],
  };

  return aliases[normalized] || [normalized];
};

const resolveImageUrl = async (imageUrl) => {
  if (!imageUrl) return '';

  if (typeof imageUrl === 'string' && imageUrl.startsWith('data:')) {
    const uploadImage = await cloudinary.uploader.upload(imageUrl, {
      folder: 'faculty_images',
    });
    return uploadImage.secure_url;
  }

  return imageUrl;
};

const buildTranslations = async (facultyName, designation, qualification) => {
  const fields = [
    { key: 'facultyName', value: facultyName },
    { key: 'designation', value: designation },
    { key: 'qualification', value: qualification },
  ];

  const [hiResults, paResults] = await Promise.all([
    Promise.all(fields.map((f) => translateText(f.value || '', 'hi'))),
    Promise.all(fields.map((f) => translateText(f.value || '', 'pa'))),
  ]);

  return {
    hi: { facultyName: hiResults[0], designation: hiResults[1], qualification: hiResults[2] },
    pa: { facultyName: paResults[0], designation: paResults[1], qualification: paResults[2] },
  };
};

export const addFaculty = async (req, res) => {
  try {
    const {
      facultyName,
      designation,
      qualification,
      totalExperience,
      imageUrl,
      email,
      phoneNumber,
      department,
    } = req.body;

    const finalImageUrl = await resolveImageUrl(imageUrl);

    const translations = await buildTranslations(facultyName, designation, qualification);

    const newFaculty = new Faculty({
      facultyName,
      designation,
      qualification,
      totalExperience: Number(totalExperience) || 0,
      imageUrl: finalImageUrl,
      email,
      phoneNumber,
      department: normalizeDepartment(department),
      translations,
    });

    await newFaculty.save();
    res.status(201).json({ message: 'Faculty added successfully', faculty: newFaculty });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const bulkAddFaculty = async (req, res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : req.body.faculties;
    if (!Array.isArray(list) || list.length === 0) {
      return res.status(400).json({ message: 'Provide an array of faculty objects.' });
    }

    const added = [];
    const failed = [];

    for (const item of list) {
      try {
        const finalImageUrl = await resolveImageUrl(item.imageUrl);

        const translations = await buildTranslations(
          item.facultyName,
          item.designation,
          item.qualification
        );

        const faculty = await new Faculty({
          facultyName: item.facultyName,
          designation: item.designation,
          qualification: item.qualification,
          totalExperience: Number(item.totalExperience) || 0,
          imageUrl: finalImageUrl,
          email: item.email || '',
          phoneNumber: item.phoneNumber || '',
          department: normalizeDepartment(item.department),
          translations,
        }).save();

        added.push(faculty);
      } catch (err) {
        failed.push({ facultyName: item.facultyName, error: err.message });
      }
    }

    res.status(201).json({
      message: `${added.length} added, ${failed.length} failed.`,
      added,
      failed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllFaculties = async (req, res) => {
  try {
    const { page, limit, search, department } = req.query;

    if (!page && !limit && !search && !department) {
      const faculties = (await Faculty.find().lean()).map((f) => ({
        ...f,
        department: normalizeDepartment(f.department),
      }));
      return res.status(200).json({ faculties });
    }

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 9;
    const skip = (pageNumber - 1) * pageSize;

    let query = {};
    if (search) {
      query.$or = [
        { facultyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (department && department !== 'All') {
      query.department = { $in: getDepartmentFilterValues(department) };
    }

    const faculties = (await Faculty.find(query).skip(skip).limit(pageSize).lean()).map((f) => ({
      ...f,
      department: normalizeDepartment(f.department),
    }));

    const total = await Faculty.countDocuments(query);

    res.status(200).json({
      faculties,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findById(id).lean();
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res
      .status(200)
      .json({ faculty: { ...faculty, department: normalizeDepartment(faculty.department) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFaculty = await Faculty.findByIdAndDelete(id);
    if (!deletedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const bulkDeleteFaculty = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Provide an array of faculty IDs to delete.' });
    }
    await Faculty.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: `${ids.length} faculties deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      facultyName,
      designation,
      qualification,
      totalExperience,
      imageUrl,
      email,
      phoneNumber,
      department,
    } = req.body;

    if (imageUrl) {
      imageUrl = await resolveImageUrl(imageUrl);
    }

    const translations = await buildTranslations(facultyName, designation, qualification);

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      id,
      {
        facultyName,
        designation,
        qualification,
        totalExperience: Number(totalExperience) || 0,
        imageUrl,
        email,
        phoneNumber,
        department: normalizeDepartment(department),
        translations,
      },
      { new: true }
    );

    if (!updatedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json({ message: 'Faculty updated successfully', faculty: updatedFaculty });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const addFacultyExcel = async (req, res) => {
  try {
    const { excelData } = req.body;

    if (!excelData) {
      return res.status(400).json({ message: 'Excel data is required' });
    }

    const base64Data = excelData.split(',')[1] || excelData;
    const buffer = Buffer.from(base64Data, 'base64');

    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty or invalid' });
    }

    const added = [];
    const failed = [];

    for (const item of data) {
      try {
        const translations = await buildTranslations(
          item.facultyName || '',
          item.designation || '',
          item.qualification || ''
        );

        const faculty = await new Faculty({
          facultyName: item.facultyName || '',
          designation: item.designation || '',
          qualification: item.qualification || '',
          totalExperience: Number(item.totalExperience) || 0,
          imageUrl:
            'https://res.cloudinary.com/ducvkar80/image/upload/v1752789612/avatars/gbuufbs2fud7mrzvcsqj.jpg',
          email: item.email || '',
          phoneNumber: item.phoneNumber || '',
          department: normalizeDepartment(item.department),
          translations,
        }).save();

        added.push(faculty);
      } catch (err) {
        failed.push({ facultyName: item.facultyName, error: err.message });
      }
    }

    res.status(201).json({
      message: `${added.length} added, ${failed.length} failed.`,
      added,
      failed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const exportFacultiesExcel = async (req, res) => {
  try {
    const faculties = await Faculty.find().lean();

    const formattedData = faculties.map((faculty) => ({
      facultyName: faculty.facultyName,
      designation: faculty.designation,
      qualification: faculty.qualification,
      totalExperience: faculty.totalExperience,
      email: faculty.email,
      phoneNumber: faculty.phoneNumber,
      department: faculty.department,
      imageUrl: faculty.imageUrl || '',
    }));

    const worksheet = xlsx.utils.json_to_sheet(formattedData);

    const workbook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Faculty');

    const buffer = xlsx.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    const base64Data = buffer.toString('base64');

    res.status(200).json({
      message: 'Export successful',
      excelBase64: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`,
      filename: 'faculties_export.xlsx',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};
