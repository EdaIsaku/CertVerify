const request = require('supertest');
const { app } = require('../src/app');

describe('GET -/main', () => {
  it('Should respond with main screen', async () => {
    const response = await request(app).get('/main');
    expect(response.headers['content-type']).toMatch('text/html');
    expect(response.text).toContain('New Participant?');
    expect(response.status).toEqual(200);
  });
});

// describe('POST -/addUser', () => {
//   it('Register user or responds with error message', () => {
//     request(app)
//       .post('/addUser')
//       .send('username=eda')
//       .send('password=test')
//       .set('Accept', 'application/json');
//   });
// });

// describe('POST -/findUser', () => {
//   it('Responds with existing user if already registered', async () => {
//     await request(app)
//       .post('/findUser')
//       .send('username=Eda', 'password=test')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200);
//   });
// });

// describe('POST -/addStudent', () => {
//   it('Responds with generated student url', () => {

//   });
// });

describe('POST -/findStudent', () => {
  const data = {
    email: 'edaisaku0@gmail.com',
  };
  const fakeData = {
    email: 'test@gmail.com',
  };
  it('Should respond with registered student', async () => {
    const response = await request(app).post('/findStudent').send(data);
    expect(response.status).toEqual(200);
    expect(response.body.email).toMatch('edaisaku0@gmail.com');
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
    expect(response.body.length).toBeGreaterThan(1);
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
