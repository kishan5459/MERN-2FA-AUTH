import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  _id: String, // session ID
  _userId: String,
  expires: Date,
  ip: String,
  userAgent: String,
  lastVisited: Date,
  session: String // the actual serialized session data as JSON string
}, {
  collection: 'sessions',
  strict: false // allows any additional fields if needed
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;
