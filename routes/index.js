
var mongoose       = require('mongoose')
  , MovieSchema    = require('../models/movie')
  , passport       = require('passport')
  , nodeMailer     = require('nodemailer')
  , crypto         = require('crypto')
  , userModel      = require('../models/user')
  , FavsSchema     = require('../models/favs')
  , FeedbackSchema = require('../models/feedback');

mongoose.connect(process.env.MONGOHQ_URL);

var MovieModel    = mongoose.model('movie', MovieSchema.Movie);
var UserModel     = mongoose.model('User', userModel.userSchema);
var FeedbackModel = mongoose.model('Feedback', FeedbackSchema.Feedback);
var FavsModel     = mongoose.model('Favs', FavsSchema.Favs);

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodeMailer.createTransport('SMTP',{
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// General Routes

exports.index = function(req, res){
  res.render('index', { title: '', user: req.user });
};

exports.about = function(req, res){
  res.render('about', { title: 'About -', user: req.user });
};

exports.changelog = function(req, res){
  res.render('changelog', {title: 'Changelog -', user: req.user });
};

// User Routes

exports.login = function(req, res){
  res.render('user/login', { title: 'Login -', user: req.user, message: req.flash('error'), info: req.flash('info') });
};

exports.register = function(req, res){
  res.render('user/register', { title: 'Register -', user: req.user, message: req.flash('error') });
};

exports.forgot = function(req, res){
  res.render('user/forgot', { title: 'Forgot Password -', user: req.user, message: req.flash('error') });
};

exports.forgotPassword = function(req, res){
  UserModel.findOne({ 'email': req.body.email }, function(err, doc){
    if (!err && doc !== null){
      crypto.randomBytes(16, function(ex, buff){
        var token = buff.toString('hex');

        UserModel.update({ 'name': doc.name }, { $set: { 'resetToken': token } }, function(err){
          if (!err){
            var uri = req.headers.origin + '/resetPassword/' + doc._id + '/' + token;

            var mailOptions = {
              from: 'Tookie App ✔ <tookieapp@gmail.com>',
              to: doc.email,
              subject: 'Tookie password reset',
              text: 'Click here to reset your password: ' + uri
            };

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function(error, response){
              if(!error){
                console.log("Message sent: " + response.message);

                req.flash('info', "You're going to recive an email with a password reset link.");
                res.redirect('/login');
              }
              else{
                console.log(error);

                req.flash('error', 'There was a problem sending the email.');
                res.redirect('/forgotpassword');
              }

              //smtpTransport.close();
            });
          }
          else{
            console.log('Error updating token of user: ' + err);
          }
        });
      });
    }
    else{
      req.flash('error', 'That email is not associated with any user.');
      res.redirect('/forgotpassword');
    }
  });
};

exports.saveNewPassword = function(req, res){
  var userDataObject = {
    id: req.params.id,
    token: req.params.token
  };

  UserModel.findOne({ '_id': userDataObject.id, 'resetToken': userDataObject.token }, function(err, doc){
    if (!err && doc !== null){
      res.render('user/savePassword', { title: 'Set new password -', user: req.user, userData: userDataObject });
    }
    else{
      res.redirect('/');
    }
  });
};

exports.postRegister = function(req, res, next){
  var user = new UserModel({ name: req.body.username, email: req.body.email, password: req.body.password });

  user.save(function(err) {
    if(err) {
      console.log('error:');
      console.log(err);

      req.flash('error', 'That user is already registered.');
       return res.redirect('/register');
    } else {
      console.log('user: ' + user.name + " saved.");

      req.logIn(user, function(err){
        if (err) { return next(err); }
        return res.redirect('/');
      });
    }
  });
};

exports.user = function(req, res){
  // MD5 (Message-Digest Algorithm) by WebToolkit
  var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

  UserModel.findOne({ 'name': req.params.name }, function(err, doc){
    if (!err){
      FavsModel.find({ 'userID': doc._id }).populate('_movie').sort('-created').exec(function(err, results){
        if (!err){
          res.render('user/account', { title: doc.name + ' -', user: req.user, paramUser: doc, hashedEmail: MD5(doc.email), favs: results });
        }
        else{
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
};

// Admin Panel

exports.adminDashboard = function(req, res){
  FeedbackModel.count({ }, function(err, resultsFeedbacks){
    if (!err){
      UserModel.count({ }, function(err, resultsUsers){
        if (!err){
          MovieModel.count({ }, function(err, resultsMovies){
            if (!err){
              UserModel.count({ 'role': 'admin' }, function(err, resultsAdmins){
                if (!err){
                  var dashboardObject = {
                    feedbacks: resultsFeedbacks,
                    users:     resultsUsers,
                    movies:    resultsMovies,
                    admins:    resultsAdmins
                  };

                  res.render('admin/dashboard', { title: 'Admin Dashboard -', user: req.user, data: dashboardObject});
                }
                else{
                  console.log('Error getting index of admins.');
                  console.log(err);
                }
              });
            }
            else{
              console.log('Error getting index of movies.');
              console.log(err);
            }
          });
        }
        else{
          console.log('Error getting index of users.');
          console.log(err);
        }
      });
    }
    else{
      console.log('Error getting index of feedbacks.');
      console.log(err);
    }
  });
};

exports.adminFeedbacks = function(req, res){
  FeedbackModel.find({ }).populate('_movie').sort('-modified').exec(function(err, results){
    if (!err){
      res.render('admin/feedbacks', { title: 'Admin Feedbacks -', user: req.user, f:  results });
    }
    else{
      console.log('Error: ' + err);
      res.send('There was a problem getting the feedbacks.');
    }
  });
};

exports.adminUsers = function(req, res){
  UserModel.find({ }).sort('-created').exec(function(err, results){
    if (!err){
      res.render('admin/users.ejs', { title: 'Admin Users -', user: req.user, u: results});
    }
    else{
      console.log('Error: ' + err);
      res.send('There was a problem getting the users.');
    }
  });
};

exports.adminEditUser = function(req, res){
  UserModel.find({ 'name': req.params.name}).sort('-created').exec(function(err, results){
    if (!err){
      res.render('admin/modals/edit-users', { title: 'Edit User -', user: req.user, u:  results });
    }
    else{
      console.log('Error: ' + err);
    }
  });
};

exports.adminSolveFeedback = function(req, res){
  FeedbackModel.find({ '_id': req.params.id }).populate('_movie').sort('-modified').exec(function(err, results){
    if (!err){
      res.render('admin/modals/edit-movie', { title: 'Edit Feedback -', user: req.user, m:  results[0]._movie[0] });
    }
    else{
      console.log('Error: ' + err);
      res.send('There was a problem getting the feedback.');
    }
  });
};

exports.adminEditMovie = function(req, res){
  MovieModel.findOne({ '_id': req.params.id }).exec(function(err, results){
    if (!err){
      res.render('admin/modals/edit-movie', { title: 'Edit Movie -', user: req.user, m:  results });
    }
    else{
      console.log('Error: ' + err);
      res.send('There was a problem getting the movie.');
    }
  });
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.postLogin = function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log(req.user.role);
      return res.redirect('/');
    });
  })(req, res, next);
};

// Movies Routes

exports.search = function(req, res){
  res.render('search', { title: 'Search -', user: req.user });
};

var isFavFromUser = function(user, movieID, callback){
  if (user !== undefined){
    FavsModel.find({ 'userID': user._id}).populate('_movie').exec(function(err, result){
      if (!err){
        console.log('result from isFav');
        console.log(result);
        // if movieID is contained in the result array then true, else false
        callback(true);
      }
      else{
        callback(false);
      }
    });
  }
  else{
    callback(false);
  }
};

exports.getMovie = function(req, res){
  MovieModel.findById(req.params.id, function (err, doc) {
    if (!err){
      isFavFromUser(req.user, req.params.id, function(r){
        console.log('result fomr R');
        console.log(r);
        res.render('movie', { movie: doc, title: doc.title + ' -', user: req.user });
      });
    }
    else{
      console.log(err);
    }
  });
};

exports.getFeedback = function(req, res){
  MovieModel.findById(req.params.id, function (err, doc) {
    if (!err)
      res.render('movie-feedback', { movie: doc });
    else
      console.log(err);
  });
};


