import cloudinary from '../config/Cloudinary.js';
import Faculty from '../models/Faculty.model.js';
import { translateText } from '../utils/translate.js';
import xlsx from 'xlsx'


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

    const uploadImage = await cloudinary.uploader.upload(imageUrl, {
      folder: 'faculty_images',
    });

    const translations = await buildTranslations(facultyName, designation, qualification);

    const newFaculty = new Faculty({
      facultyName,
      designation,
      qualification,
      totalExperience,
      imageUrl: uploadImage.secure_url,
      email,
      phoneNumber,
      department,
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
        const upload = await cloudinary.uploader.upload(item.imageUrl, {
          folder: 'faculty_images',
        });

        const translations = await buildTranslations(
          item.facultyName,
          item.designation,
          item.qualification
        );

        const faculty = await new Faculty({
          facultyName: item.facultyName,
          designation: item.designation,
          qualification: item.qualification,
          totalExperience: item.totalExperience,
          imageUrl: upload.secure_url,
          email: item.email || '',
          phoneNumber: item.phoneNumber || '',
          department: item.department || 'CSE',
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
    const faculties = await Faculty.find();
    res.status(200).json({ faculties });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.status(200).json({ faculty });
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

    if (imageUrl && imageUrl.startsWith('data:')) {
      const uploadImage = await cloudinary.uploader.upload(imageUrl, {
        folder: 'faculty_images',
      });
      imageUrl = uploadImage.secure_url;
    }

    const translations = await buildTranslations(facultyName, designation, qualification);

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      id,
      {
        facultyName,
        designation,
        qualification,
        totalExperience,
        imageUrl,
        email,
        phoneNumber,
        department,
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

    const workbook = xlsx.read(buffer, { type: "buffer" });
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
          totalExperience: item.totalExperience || 0,
          imageUrl: "https://res.cloudinary.com/ducvkar80/image/upload/v1752789612/avatars/gbuufbs2fud7mrzvcsqj.jpg",
          email: item.email || '',
          phoneNumber: item.phoneNumber || '',
          department: item.department || 'CSE',
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