var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.post('/signup', function (req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
      return res.status(200).json({
        status: 200,
        message: 'Mật khẩu không khớp!'
      });
    }
  
    if (req.body.username &&
      req.body.password &&
      req.body.passwordConf) {
  
      var userData = {
        username: req.body.username,
        password: req.body.password,
      }
  
      User.create(userData, function (error, user) {
        if (error) {
          return res.status(200).json({
            status: 200,
            message:'Lỗi truy vấn cơ sở dữ liệu!',
          })
        } else {
          return res.status(200).json({
            status: 200,
            message: 'Tạo tài khoản thành công!',
          })
        }
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: 'Vui lòng nhập đủ các trường!',
      });
    }
})

router.post('/signin', function(req, res, next) {
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function (error, user) {
          if (error || !user) {
            return res.status(200).json({
                message: error,
            })
          } else {
            req.session.userId = user._id;
            console.log(user)
            return res.status(200).json({
                message: 'Đăng nhập thành công!',
                id: user._id,
                name: user.username,
                session: res.session
            })
          }
        });
      } else {
        return res.status(200).json({
            status: 200,
            message: 'Vui lòng nhập đủ các trường!',
          });
      }
})

router.get('/logout', function (req, res, next) {
    console.log(req.session.cookie)
    if (req.session.userId) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.status(200).json({
              message: 'Đăng xuất thành công!'
          });
        }
      });
    }
    else {
        return res.status(200).json({
            message: 'Bạn chưa đăng nhập!'
        })
    }
  });

module.exports = router;