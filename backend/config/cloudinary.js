const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dhumh210h', 
  api_key: '837878367197867', 
  api_secret: 'G_BgDH8YxQhpHWKITrUXtMe-Xa8' 
});

module.exports = cloudinary;
