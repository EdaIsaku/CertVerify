let sqlite3 = require('sqlite3');

let db = new sqlite3.Database('./db/database.db');

const init = () => {
  const query = `CREATE TABLE IF NOT EXISTS Student (
    id TEXT NOT NULL,
    student_id VARCHAR(10) NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    course TEXT NOT NULL,
    course_date TEXT NOT NULL,
    course_credit TEXT NOT NULL)`;
  return new Promise((resolve, reject) => {
    db.run(query, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const addStudent = (student, id) => {
  const {
    student_id,
    first_name,
    last_name,
    email,
    course,
    course_date,
    course_credit,
  } = student;
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Student(
      id, 
      student_id,
      first_name,
      last_name,
      email,
      course,
      course_date,
      course_credit) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
      query,
      [
        id,
        student_id,
        first_name,
        last_name,
        email,
        course,
        course_date,
        course_credit,
      ],
      (err) => {
        if (err) {
          return reject(err);
        }
        console.log('new patient added in DB');
        resolve(true);
      }
    );
  });
};

const addStudentFromExcel = (rowStudentData) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Student(
    id, 
    student_id,
    first_name,
    last_name,
    email,
    course,
    course_date,
    course_credit) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
    rowStudentData.forEach((student) => {
      db.run(query, student, (err, row) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        console.log('New student added in DB');
        return resolve(row);
      });
    });
  });
};

const findStudent = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Student WHERE email="${email}"`;
    db.get(query, [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
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
        resolve(rows);
      }
    });
  });
};

const deleteStudent = (email) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM Student WHERE email="${email}"`;
    db.get(query, [], (err) => {
      if (err) {
        return reject(err);
      }
      console.log('Successfully deleted');
      resolve();
    });
  });
};

const closeDB = () => {
  db.close((err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Database is Closing...');
    process.exit();
  });
};

module.exports = {
  init,
  addStudent,
  addStudentFromExcel,
  findStudent,
  findAllStudents,
  deleteStudent,
  closeDB,
};
