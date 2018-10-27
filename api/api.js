'use strict'

const express = require('express');
const userRouter = require('./routes/users');
const groupRouter = require('./routes/groups');

var router = express.Router();

router.use('/users', userRouter);
router.use('/groups', groupRouter);


module.exports = router;