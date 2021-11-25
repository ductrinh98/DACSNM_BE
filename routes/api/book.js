const axios = require("axios");
const router = require("express").Router();
var Book = require('../../models/book');
const api = require('./search');

router.post('/searchbook', function (req, res, next) {
    if(req.body.q &&
      req.body.o) {
  
        (async() => {
            try {
            var urlString = "http://gen.lib.rus.ec";
            console.log(urlString);
            var options = {
                    mirror: urlString,
                    query: req.body.q,
                    count: 10,
                    sort_byte: req.body.o
            }
            let data = await api(options);
            let book = []
            if(data.length) {
                    data.map(el => {
                        book.push({
                            title: el.title,
                            authors: el.author,
                            description: el.descr, 
                            imageLinks: urlString+"/covers/"+el.coverurl,
                            downloadLink: "http://library.lol/main/"+ el.md5
                        });
                    })
            }
            res.status(200).json(book)
            
            } catch (err) {
            console.error(err);
            
        }
        })();
    } else {
      return res.status(200).json({
        status: 200,
        message: 'Vui lòng nhập đủ các trường!',
      })
    }
  
});

router.get('/', function (req, res, next) {
  if (req.session.userId) {
    Book.findAll(req.session.userId, function(error, books) {
      if (error || !books) {
        return res.status(200).json({
            message: error,
        })
      } else {
        return res.status(200).json({
            ...books,
        })
      }
    });
  } else {
    return res.status(401).json({
      req: req.session,
      message: 'Bạn cần đăng nhập!',
    })
  }
});

router.post('/', function (req, res, next) {
  // console.log(req.session)
  if (req.session.userId) {
    console.log(req.body)
    Book.createbook(req.body, function(error, book) {
      if (error || !book) {
        return res.status(200).json({
            message: error,
        })
      } else {
        return res.status(200).json({
            ...book,
            message: 'Thêm thành công!'
        })
      }
    });
  } else {
    return res.status(401).json({
      message: 'Bạn cần đăng nhập!',
    })
  }
});

router.delete('/:id', function (req, res, next) {
  if (req.session.userId) {
    Book.removebook(req.params.id, function(error, book) {
      if (error || !book) {
        return res.status(200).json({
            message: error,
        })
      } else {
        return res.status(200).json({
            ...book,
            message: 'Xoá thành công!'
        })
      }
    });
  } else {
    return res.status(401).json({
      message: 'Bạn cần đăng nhập!',
    })
  }
});
module.exports = router