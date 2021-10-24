let sqlite3 = require('sqlite3');

let db = new sqlite3.Database('./db/database.db');

const init = () => {
  const query = `CREATE TABLE IF NOT EXISTS Student (
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    course TEXT NOT NULL,
    date TEXT NOT NULL,
    credit INTEGER NOT NULL)`;
  return new Promise((resolve, reject) => {
    db.run(query, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const addStudent = (student) => {
  const { first_name, last_name, email, course, date, credit } = student;
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Student(
      first_name,
      last_name,
      email,
      course,
      date,
      credit) VALUES(?, ?, ?, ?, ?, ?)`;

    db.run(
      query,
      [first_name, last_name, email, course, date, credit],
      (err, row) => {
        if (err) {
          return reject(err);
        }
        return resolve(row); // gjithmone mbaj mend qe resolve('Ajo cka me duhet mua')
      }
    );
  });
};

const findStudent = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Student WHERE email="${email}"`;
    db.get(query, [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row); // email eshte unik, nuk mund te kthej rows
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

// const closeDB = () => {
//   db.close((err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('Database is Closing...');
//     }
//   });
// };

module.exports = {
  init,
  addStudent,
  findStudent,
  findAllStudents,
  deleteStudent,
  // closeDB,
};
