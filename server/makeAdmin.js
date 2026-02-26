const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const user = await User.findOneAndUpdate(
    { email: 'ananyaamg@gmail.com' },
    { isAdmin: true },
    { new: true }
  );
  console.log('Admin set:', user?.name, '| isAdmin:', user?.isAdmin);
  mongoose.disconnect();
});
