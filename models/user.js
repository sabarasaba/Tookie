var mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({
  name          : { type: String, required: true, unique: true },
  email         : { type: String, required: true, unique: true },
  password      : { type: String, required: true },
  role          : { type: String, default: 'user' },
  created       : { type: Date, default: Date.now },
  favs          : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favs' }]
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

exports.userSchema = userSchema;