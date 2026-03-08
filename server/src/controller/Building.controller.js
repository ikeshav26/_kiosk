import Building from '../models/Building.model.js';
import cloudinary from '../config/Cloudinary.js';

export const addBuilding = async (req, res) => {
  try {
    const {
      name,
      code,
      type,
      description,
      coordinates,
      totalFloors,
      isAccessible,
      hasLift,
      rooms,
      departments,
      openTime,
      closeTime,
      isOpenWeekends,
      contactNumber,
      contactEmail,
      departmentInfo,
      imageUrl = [],
    } = req.body;

    console.log(imageUrl);

    if (!name || !type || !coordinates || !coordinates.lat || !coordinates.lng) {
      return res
        .status(400)
        .json({ message: 'Name, type, and coordinates (lat,lng) are required' });
    }

    const uploadedImageArray = [];
    for (const image of imageUrl) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'kiosk/buildings',
        resource_type: 'image',
      });
      uploadedImageArray.push(uploadResult.secure_url);
    }

    console.log(uploadedImageArray);

    const newBuilding = new Building({
      name,
      code,
      type,
      description,
      coordinates,
      totalFloors,
      isAccessible,
      hasLift,
      rooms,
      departments,
      openTime,
      closeTime,
      isOpenWeekends,
      contactNumber,
      contactEmail,
      departmentInfo,
      imageUrl: uploadedImageArray,
    });

    const savedBuilding = await newBuilding.save();
    res.status(201).json(savedBuilding);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    console.log(err);
  }
};

export const getAllBuildings = async (req, res) => {
  try {
    const { page, limit, search, type } = req.query;

    if (!page && !limit && !search && !type) {
      const buildings = await Building.find();
      const stats = {
        total: buildings.length,
        block: buildings.filter((b) => b.type === 'block').length,
        library: buildings.filter((b) => b.type === 'library').length,
        lab: buildings.filter((b) => b.type === 'lab').length,
      };
      return res.status(200).json({ buildings, stats });
    }

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 6;
    const skip = (pageNumber - 1) * pageSize;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }
    if (type && type !== 'all') {
      query.type = type;
    }

    const buildings = await Building.find(query).skip(skip).limit(pageSize);
    const total = await Building.countDocuments(query);

    // Calculate overall stats regardless of query to keep dashboard consistent
    const allBuildings = await Building.find({}, 'type');
    const stats = {
      total: allBuildings.length,
      block: allBuildings.filter((b) => b.type === 'block').length,
      library: allBuildings.filter((b) => b.type === 'library').length,
      lab: allBuildings.filter((b) => b.type === 'lab').length,
    };

    res.status(200).json({
      buildings,
      stats,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getBuildingById = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }
    res.status(200).json(building);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateBuilding = async (req, res) => {
  try {
    const updated = await Building.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Building not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBuilding = await Building.findByIdAndDelete(id);
    res.status(200).json({ message: 'Building deleted successfully', deletedBuilding });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    console.log(err);
  }
};

export const bulkDeleteBuildings = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Provide an array of building IDs to delete.' });
    }
    await Building.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: `${ids.length} buildings deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    console.log(err);
  }
};
