// src\app\models\session.js
const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema({
  // id: { type: String, unique: false }, // UNIQUE REMOVE KAR DIYA
  state: { type: String },
  shop: { type: String, trim: true, unique: true }, // Shop unique rahega
  accessToken: { type: String, trim: true },
  isOnline: { type: Boolean, enum: [true, false], default: false },
  scope: { type: [String], default: [] },
  isInstalled: { type: Boolean, default: true }, // Track installation state
  uninstalledAt: { type: Date, default: null },  // Track uninstall timestamp
});
const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);
export default Session;







// const mongoose = require("mongoose");
// const sessionSchema = new mongoose.Schema({
//     id: {
//         type: String,
//     },
//     state: {
//         type: String,
//     },
//     shop: {
//         type: String,
//         trim: true,
//     },
//     accessToken: {
//         type: String,
//         trim: true,
//     },
//     isOnline: {
//         type: Boolean,
//         enum: [true, false],
//         default: false,
//     },
//     scope: {
//         type: [String],
//         default: [],
//     },
// });
// // Check if the model already exists to prevent OverwriteModelError
// const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);
// export default Session;