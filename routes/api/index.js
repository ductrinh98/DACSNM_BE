const router = require("express").Router();
const book = require("./book");
const user = require("./user");


router.use('/book', book);
router.use('/user', user);

module.exports = router;