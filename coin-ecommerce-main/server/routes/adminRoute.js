// server/routes/adminRoute.js

const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');

// এই রাউটে হিট করলে স্ট্যাটাস পাবে
// তুমি চাইলে এখানে অ্যাডমিন ভেরিফিকেশন মিডলওয়্যার (isAdmin) বসাতে পারো
router.get('/stats', getAdminStats);

module.exports = router;