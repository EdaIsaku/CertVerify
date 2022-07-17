const express = require('express');
const rootRouter = express.Router();

// const main = require('./main');
const addAdmin = require('./addAdmin');
const findAdmin = require('./findAdmin');
const deleteAdmin = require('./deleteAdmin');

const addStudent = require('./addStudent');
const findStudent = require('./findStudent');
const findAllStudents = require('./findAllStudents');
const deleteStudent = require('./deleteStudent');

const exportExcel = require('./exportExcel');

// rootRouter.use(main);
rootRouter.use(addAdmin);
rootRouter.use(findAdmin);
rootRouter.use(deleteAdmin);

rootRouter.use(addStudent);
rootRouter.use(findStudent);
rootRouter.use(findAllStudents);
rootRouter.use(deleteStudent);

rootRouter.use(exportExcel);

module.exports = rootRouter;
