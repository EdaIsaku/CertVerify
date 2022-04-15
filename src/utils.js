const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const QRCode = require('qrcode');
const { DateTime } = require('luxon');
const db = require('./db/db');
const { logger } = require('./logger/logger');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const selectCertificate = (course) => {
  const certificate = fs.readFileSync(
    `${__dirname}/public/assets/${course}_Certificate.pdf`
  );
  return certificate;
};

const BLSD_Certificate = selectCertificate('BLSD');
const BLS_T_Certificate = selectCertificate('BLS_T');
const ACLS_Certificate = selectCertificate('ACLS');
const TH_Certificate = selectCertificate('TH');

const templates = {
  BLSD: BLSD_Certificate,
  BLS_T: BLS_T_Certificate,
  ACLS: ACLS_Certificate,
  TH: TH_Certificate,
};

//customize QRcode view
var opts = {
  errorCorrectionLevel: 'H',
  quality: 0.3,
  margin: 1,
  boxShadow: 15,
  color: {
    dark: '#111d13',
    light: '#fff',
  },
};

const generateQRCode = async (cert) => {
  const qrcode = await QRCode.toDataURL(cert, opts);
  return qrcode;
};

const calcExpireDay = (registrationDay) => {
  registrationDay = DateTime.fromFormat(`${registrationDay}`, 'yyyy-MM-dd');
  const expireDay = registrationDay.plus({
    year: 3,
  });
  return expireDay.toFormat('dd/MM/yyyy').toLocaleString();
};

const generatePdf = async (student) => {
  const { course, email, first_name, last_name, course_credit, course_date } =
    student;
  const studentFromDB = await db.findStudent(email);
  const id = await studentFromDB.id;
  const template = await PDFDocument.load(templates[course]);

  template.setAuthor('Eda Isaku');

  const Courier = await template.embedFont(StandardFonts.Courier);

  const form = template.getForm();
  const name = form.getField('name');
  const courseDate = form.getField('courseDate');
  const credit = form.getField('credit');
  const qrcode = form.getField('qrcode');
  const expiredate = form.getField('expireDate');

  const smallFontFields = [courseDate, expiredate, credit];

  const qrCodeURL = await generateQRCode(`http://192.168.0.105:3000/me/${id}`);
  const qrImage = await template.embedPng(qrCodeURL);
  qrcode.setImage(qrImage);

  const fullName = `${first_name.toUpperCase()} ${last_name.toUpperCase()}`;
  name.setText(fullName);
  name.setFontSize(28);
  const dateFormat = DateTime.fromFormat(`${course_date}`, 'yyyy-MM-dd');
  courseDate.setText(dateFormat.toFormat('dd/MM/yyyy').toLocaleString());

  expiredate.setText(calcExpireDay(course_date));
  credit.setText(course_credit);

  smallFontFields.forEach((el) => {
    el.defaultUpdateAppearances(Courier);
    el.setFontSize(15);
  });

  form.flatten();
  const pdfBytes = await template.save({
    updateFieldAppearances: false,
  });
  fs.mkdir(
    path.join(__dirname, `/Certificates/${course}_Certificates`),
    { recursive: true },
    (err) => {
      if (err) {
        return logger.error('error ?', err);
      }
      logger.info('Directory created successfully!');
    }
  );
  fs.writeFile(
    `./src/Certificates/${course}_Certificates/${id}.pdf`,
    pdfBytes,
    (err) => {
      if (err) throw err;
      logger.info('The file has been saved!');
    }
  );
};

const statistics = async () => {
  const allStudents = await db.findAllStudents();
  let BLSDStudents = 0;
  let BLS_TStudents = 0;
  let ACLSStudents = 0;
  let THStudents = 0;
  let totalStudents = 0;
  Object.values(allStudents).map((el) => {
    if (el.course === 'BLSD') {
      BLSDStudents++;
    } else if (el.course === 'BLS_T') {
      BLS_TStudents++;
    } else if (el.course === 'TH') {
      THStudents++;
    } else {
      ACLSStudents++;
    }
  });
  totalStudents = BLSDStudents + BLS_TStudents + ACLSStudents + THStudents;
  return {
    BLSDStudents,
    BLS_TStudents,
    ACLSStudents,
    THStudents,
    totalStudents,
  };
};

//administrator registration
const hashPassword = (password, cb) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    return bcrypt.hash(password, salt, (err, hash) => {
      let hashedPass = hash;
      cb(hashedPass);
    });
  });
};

const comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = { generatePdf, statistics, hashPassword, comparePassword };
