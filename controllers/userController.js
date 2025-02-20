const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, lawyers } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate role and relationships
    if (role === 'firm' && lawyers && lawyers.length > 0) {
      return res.status(400).json({ message: "Firms cannot have associated lawyers during signup. Add lawyers later." });
    }

    if (role !== 'firm' && lawyers) {
      return res.status(400).json({ message: "Only firms can have associated lawyers." });
    }

    // Create the user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      lawyers: role === 'firm' ? lawyers : undefined, // Only add lawyers for 'firm' role
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.status(200).json({ resetToken, message: 'Password reset token generated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.user || !decoded.user.id) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = await User.findById(decoded.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a Lawyer to a Firm
exports.addLawyerToFirm = async (req, res) => {
  try {
    const { lawyerId, name, email, password } = req.body;
    const firmId = req.user.id;  // The ID of the authenticated firm

    // Ensure the user is a firm
    const firm = await User.findById(firmId);
    if (!firm || firm.role !== 'firm') {
      return res.status(403).json({ message: 'Only firms can add lawyers.' });
    }

    // Check if the lawyer exists in the system
    let lawyer = await User.findById(lawyerId);

    // If the lawyer doesn't exist, create a new user account as a lawyer
    if (!lawyer) {
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required to create a new lawyer account.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new lawyer account
      lawyer = new User({
        name,
        email,
        password: hashedPassword,
        role: 'lawyer',
        firmId: firmId,  // Set the firmId to associate this lawyer with the firm
      });

      await lawyer.save();  // Save the new lawyer
    }

    // Ensure the lawyer's role is 'lawyer'
    if (lawyer.role !== 'lawyer') {
      return res.status(400).json({ message: 'This user is not a lawyer.' });
    }

    // Check if the lawyer is already associated with another firm
    if (lawyer.firmId && lawyer.firmId.toString() == firmId.toString()) {
      return res.status(200).json({ message: 'Lawyer added  to firm successfully.' });
    }

    // Check if the lawyer is already associated with another firm
    if (lawyer.firmId && lawyer.firmId.toString() !== firmId.toString()) {
      return res.status(400).json({
        message: 'This lawyer is already associated with another firm. Kindly submit a removal request to your previous firm in order to join this one.',
      });
    }

    // Add the lawyer to the firm’s lawyers list
    if (!firm.lawyers.includes(lawyerId)) {
      firm.lawyers.push(lawyerId);
      await firm.save();  // Save the updated firm
    } 

    res.status(200).json({ message: 'Lawyer added to firm successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Lawyers Under a Firm
exports.getLawyersByFirm = async (req, res) => {
  try {
    const firmId = req.user.id.toString();  // The ID of the authenticated firm

    // Ensure the user is a firm
    const firm = await User.findById(firmId).populate('lawyers', 'name email'); // Populate lawyers

    if (!firm || firm.role !== 'firm') {
      return res.status(403).json({ message: 'Only firms can access their lawyers.' });
    }

    res.status(200).json(firm.lawyers);  // Return the populated lawyers list
  } catch (error) {
    console.error('Error fetching lawyers by firm:', error);
    res.status(500).json({ error: error.message });
  }
};


// Remove a Lawyer from a Firm
exports.removeLawyerFromFirm = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const firmId = req.user.id;

    // Ensure the user is a firm
    const firm = await User.findById(firmId);
    if (!firm || firm.role !== 'firm') {
      return res.status(403).json({ message: 'Only firms can remove lawyers.' });
    }

    // Ensure the lawyer exists and is associated with the firm
    if (!firm.lawyers.includes(lawyerId)) {
      return res.status(404).json({ message: 'Lawyer not associated with this firm.' });
    }

    // Remove the lawyer from the firm's lawyers list
    firm.lawyers.pull(lawyerId);
    await firm.save();

    res.status(200).json({ message: 'Lawyer removed from firm successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
