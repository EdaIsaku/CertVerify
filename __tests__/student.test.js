const request = require('supertest');
const { app } = require('../src/app');

describe('GET -/main', () => {
  it('Should respond with main screen', async () => {
    const response = await request(app).get('/main');
    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch('text/html');
    expect(response.text).toContain('New Participant?');
  });
});

//TODO check if it is sending the right file
// describe('GET -/me/:course/:id', () => {
//   it('Should respond with certificate', async () => {
//     const response = await request(app).get(
//       '/me/BLSD/0e607616-527c-4dde-ab76-f1432f3eb4fa'
//     );
//     console.log(response.body);
//     expect(response.status).toEqual(200);
//     expect(response.headers['content-type']).toMatch('application/pdf');
//   });
// });

describe('POST -/addStudent', () => {
  it('Should add student to Student table', async () => {
    const data = {
      course: 'BLSD',
      email: 'test@gmail.com',
      course_date: '2022-04-22',
      course_credit: '3',
      first_name: 'Test',
      last_name: 'Test',
      student_id: 'Q111111Q',
    };
    await request(app).post('/deleteStudent').send(data);
    const response = await request(app).post('/addStudent').send(data);
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Student successfully registered!');
  });
});

describe('POST -/findStudent', () => {
  const data = {
    email: 'test@gmail.com',
  };
  const fakeData = {
    email: 'test2@gmail.com',
  };
  it('Should respond with registered student', async () => {
    const response = await request(app).post('/findStudent').send(data);
    expect(response.status).toEqual(200);
    expect(response.body.email).toMatch('test@gmail.com');
  });
  it('Should respond with 400, not registered', async () => {
    const response = await request(app).post('/findStudent').send(fakeData);
    expect(response.status).toEqual(400);
    expect(response.text).toMatch('Student is not registered yet!');
  });
});

describe('POST -/findAllStudent', () => {
  it('Should return all registered students', async () => {
    const response = await request(app).post('/findAllStudents');
    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe('POST -/deteStudent', () => {
  const data = {
    email: 'test@gmail.com',
  };
  it('Should delete specific student', async () => {
    const response = await request(app).post('/deleteStudent').send(data);
    expect(response.status).toEqual(200);
  });
});
