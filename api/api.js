'use strict'

const express = require('express');
const userRouter = require('./routes/users');
const groupRouter = require('./routes/groups');
const entryRouter = require('./routes/entries');

var router = express.Router();

router.use('/users', userRouter);
router.use('/groups', groupRouter);
router.use('/entries', entryRouter);


module.exports = router;