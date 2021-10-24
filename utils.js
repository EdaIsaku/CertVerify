const fs = require('fs');
const path = require('path');

const { PDFDocument, StandardFonts } = require('pdf-lib');
const QRCode = require('qrcode');

// const certFiles = {
//   ACLS: '',
//   BLSD: '',
// };

const selectCertificate = (course) => {
  const certificate = fs.readFileSync(
    `${__dirname}/assets/${course}_Certificate.pdf`
  );
  return certificate;
};

const BLSD_Certificate = selectCertificate('BLSD');

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
const generateQRCode = async (email) => {
  const qrcode = await QRCode.toDataURL(email, opts);
  return qrcode;
};

const student = 'Eda_Isaku';

const generatePdf = async () => {
  const BLSD_template = await PDFDocument.load(BLSD_Certificate);
  BLSD_template.setAuthor('Eda Isaku');
  const Courier = await BLSD_template.embedFont(StandardFonts.Courier);
  const getField = (fieldName) => {
    return form.getField(fieldName);
  };

  const form = BLSD_template.getForm();
  const name = getField('name');
  const date = getField('date');
  const credit = getField('credit');
  const qrcode = getField('qrcode');
  const allFields = [date, credit];

  const qrCodeURL = await generateQRCode('eda');
  const qrImage = await BLSD_template.embedPng(qrCodeURL);
  qrcode.setImage(qrImage);

  name.setText(student);
  name.setFontSize(30);

  date.setText('01/12/2021');
  credit.setText('3');

  allFields.forEach((el) => {
    el.defaultUpdateAppearances(Courier);
    el.setFontSize(15);
  });

  form.flatten();
  const pdfBytes = await BLSD_template.save();

  fs.mkdir(
    path.join(__dirname, 'BLSD_Certificates'),
    { recursive: true },
    (err) => {
      if (err) {
        return console.error(err);
      }
      console.log('Directory created successfully!');
    }
  );

  fs.writeFile(`./BLSD_Certificates/${student}.pdf`, pdfBytes, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
};

module.exports = { generatePdf };
