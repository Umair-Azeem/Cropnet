


const User = require('../models/User'); 

exports.register = async (req, res) => {
    console.log('Registration request received:', req.body);
    const { name, email, password, role,address } = req.body;
    console.log('Extracted data:', { name, email, password: password ? '[HIDDEN]' : 'undefined', role });

    try {
        // Check if user already exists
        console.log('Checking for existing user with email:', email);
        const existingUser = await User.findOne({ email });
        console.log('Database query result:', existingUser ? 'User found' : 'No user found');
        if (existingUser) {
            console.log('Existing user details:', { id: existingUser._id, email: existingUser.email, name: existingUser.name });
            return res.status(400).json({ message: 'Email already registered' });
        }
        console.log('No existing user found, proceeding with registration...');

        // Create user without hashing password (not secure)
        const newUser = await User.create({
            name,
            email,
            password, 
            role,
            address
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Direct password check (no hashing)
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }
          const userobject=user.toObject();
        // Success: return user id and role
        res.status(200).json({
            message: "Login successful",
           user:userobject
        });

    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};
