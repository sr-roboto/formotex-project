import mongoose, { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'], unique: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
    role: { type: [String], default: ['USER'] },
    enum: ['USER', 'ADMIN'],
  },
  { timestamps: true }
);

export const UserModel = model('User', userSchema);
