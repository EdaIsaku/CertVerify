let sqlite3 = require('sqlite3');

let db = new sqlite3.Database('./db/database.db');
const init = () => {
  const query = `CREATE TABLE IF NOT EXISTS Student (first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL,
    date TEXT NOT NULL,
    credit INTEGER NOT NULL)`;
  return new Promise((resolve, reject) => {
    db.run(query, (err) => {
      if (err) {
        return reject(err);
      }
      resolve('Created');
      console.log('created');
    });
  });
};

const addStudent = (student) => {
  const { first_name, last_name, email, course, date, credit } = student;
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Student(first_name,
      last_name,
      email,
      course,
      date,
      credit) VALUES(?, ?, ?, ?, ?, ?)`;

    db.run(
      query,
      [first_name, last_name, email, course, date, credit],
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve('Row added');
      }
    );
  });
};

const findStudent = (student) => {
  const { email } = student;
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Student WHERE email="${email}"`;
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => {
          resolve(row);
        });
      }
    });
  });
};

const findAllStudents = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Student';
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => {
          resolve(row);
        });
      }
    });
  });
};

const deleteStudent = (student) => {
  const { email } = student;
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM Student WHERE email="${email}"`;
    db.all(query, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      rows.forEach((row) => resolve(row));
    });
  });
};

const closeDB = () => {
  db.close((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Database is Closing...');
    }
  });
};

module.exports = {
  init,
  addStudent,
  findStudent,
  findAllStudents,
  deleteStudent,
  closeDB,
};
