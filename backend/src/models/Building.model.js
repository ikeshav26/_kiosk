import mongoose from 'mongoose';

const BuildingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, uppercase: true, trim: true },
    type: {
      type: String,
      enum: [
        'block',
        'library',
        'canteen',
        'hostel',
        'admin',
        'lab',
        'auditorium',
        'medical',
        'other',
      ],
      required: true,
    },
    description: { type: String },

    coordinates: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },

    totalFloors: { type: Number, default: 2 },
    isAccessible: { type: Boolean, default: true },
    hasLift: { type: Boolean, default: false },

    rooms: [
      {
        roomNumber: { type: String },
        roomName: { type: String },
        floor: { type: Number, default: 0 },
        type: {
          type: String,
          enum: ['classroom', 'lab', 'office', 'washroom', 'staircase', 'other'],
        },
        coordinates: {
          x: { type: Number },
          y: { type: Number },
        },
      },
    ],

    departments: [{ type: String }],

    departmentInfo: {
      about: { type: String },
      coursesOffered: [{ type: String }],
    },

    openTime: { type: String, default: '09:00' },
    closeTime: { type: String, default: '16:00' },
    isOpenWeekends: { type: Boolean, default: false },

    contactNumber: { type: String },
    contactEmail: { type: String },

    isActive: { type: Boolean, default: true },
    isUnderMaintenance: { type: Boolean, default: false },

    imageUrl: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Building = mongoose.model('Building', BuildingSchema);
export default Building;

//input example
// {
//   "name": "Central Library",
//   "code": "LIB",
//   "type": "library",
//   "description": "Main campus library with reading halls, digital resources, and study rooms.",
//   "coordinates": { "x": 150, "y": 400 },
//   "totalFloors": 2,
//   "isAccessible": true,
//   "hasLift": false,
//   "rooms": [
//     {
//       "roomNumber": "G-01",
//       "roomName": "Issue & Return Counter",
//       "floor": 0,
//       "type": "office",
//       "coordinates": { "x": 152, "y": 402 }
//     },
//     {
//       "roomNumber": "101",
//       "roomName": "Digital Resource Lab",
//       "floor": 1,
//       "type": "lab",
//       "coordinates": { "x": 150, "y": 395 }
//     }
//   ],
//   "departments": ["All Departments"],
//   "openTime": "08:00",
//   "closeTime": "20:00",
//   "isOpenWeekends": true,
//   "contactNumber": "9123456780",
//   "contactEmail": "library@campus.edu",
//   "isActive": true,
//   "isUnderMaintenance": false,
//   "imageUrl": [
//     "https://example.com/images/library-front.jpg",
//     "https://example.com/images/library-inside.jpg"
//   ]
// }
