import mongoose from 'mongoose';

// Define the schema for users
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

const User = mongoose.model('User', userSchema);

export default User;
