import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User schema
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true, // Ensures no duplicate emails
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            enum: ['admin', 'alumni'], // Allowed roles
            default: 'alumni', // Default role is alumni
        },
        isVerified: {
            type: Boolean,
            default: false, // Default: email not verified
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Middleware to hash password before saving a user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); // Hash password
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
export default mongoose.model('User', UserSchema);
