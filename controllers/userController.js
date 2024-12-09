// // controllers/userController.js

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// exports.registerUser = async (req, res) => {
//     const { name, email, password, role } = req.body;

//     try {
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const allowedRoles = ['admin', 'legal_researcher', 'lawyer', 'judge', 'legal_professional'];
//         if (!allowedRoles.includes(role)) {
//             return res.status(400).json({ message: 'Invalid user role' });
//         }

//         user = new User({ name, email, password, role });
//         const salt = await bcrypt.genSalt(12); // Increase rounds for stronger hashing
//         user.password = await bcrypt.hash(password, salt);
//         await user.save();

//         const payload = { id: user.id };
//         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.status(201).json({ token, user });
//     } catch (error) {
//         console.error(error); // Log the actual error for debugging
//         res.status(500).json({ message: 'Registration failed' });
//     }
// };

// // Login user
// exports.loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const payload = { id: user.id };
//         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.json({ token, user });
//     } catch (error) {
//         console.error(error); // Log the actual error for debugging
//         res.status(500).json({ message: 'Login failed' });
//     }
// };

// // Update user password
// // exports.updatePassword = async (req, res) => {
// //     const { oldPassword, newPassword } = req.body;

// //     try {
// //         const user = await User.findById(req.user.id);
// //         if (!user) {
// //             return res.status(404).json({ message: 'User not found' });
// //         }

// //         const isMatch = await bcrypt.compare(oldPassword, user.password);
// //         if (!isMatch) {
// //             return res.status(400).json({ message: 'Invalid current password' }); // More specific message
// //         }

// //         const salt = await bcrypt.genSalt(12); // Increase rounds for stronger hashing
// //         user.password = await bcrypt.hash(newPassword, salt);
// //         await user.save();

// //         res.json({ message: 'Password updated successfully' });
// //     } catch (error) {
// //         console.error(error); // Log the actual error for debugging
// //         res.status(500).json({ message: 'Error updating password' });
// //     }
// // };

// // Delete user account
// // exports.deleteAccount = async (req, res) => {
// //     try {
// //         // Add authorization check if needed (e.g., verify user role)
// //         const user = await User.findByIdAndDelete(req.user.id);
// //         if (!user) {
// //             return res.status(404).json({ message: 'User not found' });
// //         }
// //         res.json({ message: 'User account deleted successfully' });
// //     } catch (error) {
// //         console.error(error); // Log the actual error for debugging
// //         res.status(500).json({ message: 'Error deleting account' });
// //     }
// // };

// // // Edit user profile
// // exports.editProfile = async (req, res) => {
// //     const { name, email, role } = req.body;

// //     try {
// //         const user = await User.findById(req.user.id);
// //         if (!user) {
// //             return res.status(404).json({ message: 'User not found' });
// //         }

// //         if (name) user.name = name;
// //         if (email) {
// //             // Check for valid email format and existing email (if applicable)
// //             // Update error message if email update fails validation
// //             user.email = email;
// //         }
// //         if (role) {
// //             const allowedRoles = ['admin', 'legal_researcher', 'lawyer', 'judge', 'legal_professional'];
// //             if (!allowedRoles.includes(role)) {
// //                 return res.status(400).json({ message: 'Invalid user role' });
// //             }
// //             user.role = role;
// //         }

// //         await user.save();
// //         res.json({ message: 'Profile updated successfully', user });
// //     } catch (error) {
// //         console.error(error); // Log the actual error for debugging
// //         res.status(500).json({ message: 'Error updating profile' });
// //     }
// // };


// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user (Signup)
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Create JWT token
        const payload = {
            user: { id: user.id }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate user (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            user: { id: user.id }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user information (name, email, etc.)
// @route   PUT /api/users/profile
// @access  Private
const updateUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        let user = await User.findById(req.user.id);

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateUser,
    deleteUser,
    updatePassword
};
