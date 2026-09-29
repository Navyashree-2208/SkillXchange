const admin = require('firebase-admin');
const UserProfile = require('../models/UserSchema');

const firebaseAuthMiddleware = async (req, res, next) => {
  console.log('Entering firebaseAuthMiddleware');
  
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader ? 'Present' : 'Missing');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    console.log('Verifying token');
    if (!admin.apps.length) {
      console.error('Firebase Admin not initialized');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Token verified, email:', decodedToken.email);

    const user = await UserProfile.findOne({ "User.Personal_info.Email": decodedToken.email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'Unauthorized: User not found in database' });
    }

    req.user = {
      _id: user._id,
      email: user.User.Personal_info.Email
    };
    console.log('User attached to request');
    next();
  } catch (error) {
    console.error('Error in firebaseAuthMiddleware:', error);
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Unauthorized: Token expired' });
    }
    return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
  }
};

module.exports = { firebaseAuthMiddleware };