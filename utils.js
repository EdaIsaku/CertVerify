const fs = require('fs');
const path = require('path');

const db = require('./db');

const { PDFDocument, StandardFonts } = require('pdf-lib');
const QRCode = require('qrcode');
const { DateTime } = require('luxon');

const { logger } = require('./public/logger/logger');

const selectCertificate = (course) => {
  const certificate = fs.readFileSync(
    `${__dirname}/assets/${course}_Certificate.pdf`
  );
  return certificate;
};

const BLSD_Certificate = selectCertificate('BLSD');

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
  const { email, first_name, last_name, course_credit, course_date } = student;
  const studentFromDB = await db.findStudent(email);
  const id = await studentFromDB.id;
  const BLSD_template = await PDFDocument.load(BLSD_Certificate);
  BLSD_template.setAuthor('Eda Isaku');
  const Courier = await BLSD_template.embedFont(StandardFonts.Courier);

  const form = BLSD_template.getForm();
  const name = form.getField('name');
  const courseDate = form.getField('courseDate');
  const credit = form.getField('credit');
  const qrcode = form.getField('qrcode');
  const expiredate = form.getField('expireDate');

  const smallFontFields = [courseDate, expiredate, credit];

  const qrCodeURL = await generateQRCode(`http://192.168.0.102:3000/me/${id}`);
  const qrImage = await BLSD_template.embedPng(qrCodeURL);
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
  const pdfBytes = await BLSD_template.save({ updateFieldAppearances: false });

  fs.mkdir(
    path.join(__dirname, 'BLSD_Certificates'),
    { recursive: true },
    (err) => {
      if (err) {
        return logger.error('error', err);
      }
      logger.info('info', 'Directory created successfully!');
    }
  );

  fs.writeFile(`./BLSD_Certificates/${id}.pdf`, pdfBytes, (err) => {
    if (err) throw err;
    logger.info('info', 'The file has been saved!');
  });
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
module.exports = { generatePdf, statistics };
