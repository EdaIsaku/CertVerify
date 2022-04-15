const path = require('path');
const ExcelJS = require('exceljs');
const db = require('../db/db');
const { generatePdf } = require('../utils');
const { logger } = require('../logger/logger');

const excelPath = path.join(__dirname, '/Certificate.xlsx');

const generateExcel = async () => {
  //create new workbook
  let workbook = new ExcelJS.Workbook();
  workbook.creator = 'Eda Isaku';
  workbook.modified = new Date();

  //new worksheet for every course
  const blsd_worksheet = workbook.addWorksheet('BLSD_Students');
  const bls_t_worksheet = workbook.addWorksheet('BLS_T_Students');
  const acls_worksheet = workbook.addWorksheet('ACLS_Students');
  const th_worksheet = workbook.addWorksheet('TH_Students');

  const worksheets = [
    blsd_worksheet,
    bls_t_worksheet,
    acls_worksheet,
    th_worksheet,
  ];

  //get all registred students
  const students = await db.findAllStudents();

  //set headers to each worksheet
  worksheets.map((worksheet) => {
    worksheet.columns = [
      { header: 'id', key: 'id', width: 28 },
      { header: 'student_id', key: 'student_id' },
      { header: 'first_name', key: 'first_name' },
      { header: 'last_name', key: 'last_name' },
      { header: 'email', key: 'email', width: 22 },
      { header: 'course', key: 'course' },
      { header: 'course_date', key: 'course_date' },
      { header: 'course_credit', key: 'course_credit' },
    ];
  });

  //fill worksheet with registererd students
  Object.values(students).forEach((student) => {
    if (student.course === 'BLSD') {
      blsd_worksheet.addRow(student);
    } else if (student.course === 'BLS_T') {
      bls_t_worksheet.addRow(student);
    } else if (student.course === 'ACLS') {
      acls_worksheet.addRow(student);
    } else if (student.course === 'TH') {
      th_worksheet.addRow(student);
    }
  });

  //add border
  let borderStyles = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  worksheets.map((worksheet) => {
    worksheet.eachRow({ includeEmpty: true }, function (row) {
      row.eachCell({ includeEmpty: true }, function (cell) {
        cell.border = borderStyles;
      });
    });
  });

  //style header
  worksheets.map((worksheet) => {
    worksheet.getRow(1).font = {
      name: 'Helvetica',
      family: 4,
      size: 12,
      color: { argb: '03BEBE' },
    };
  });

  //add default column width
  worksheets.map((worksheet) => {
    worksheet.properties.defaultColWidth = 14;
  });

  await workbook.xlsx.writeFile(excelPath);

  return excelPath;
};

const excelToDb = async (filename) => {
  let workbook = new ExcelJS.Workbook();
  const rows = [];
  await workbook.xlsx.readFile(filename).then(() => {
    let worksheets = [];
    //read every worksheet
    for (let i = 1; i <= 4; i++) {
      worksheets.push(workbook.getWorksheet(i));
    }
    worksheets.forEach((worksheet) => {
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        rows.push(row.values.slice(1));
        console.log('added from excel');
        logger.info('added');
      });
    });
  });
  await db.addStudentFromExcel(rows.slice(1));
  let myDB = await db.findAllStudents();
  myDB.forEach((student) => {
    generatePdf(student);
  });
  return true;
};

module.exports = {
  generateExcel,
  excelToDb,
};
