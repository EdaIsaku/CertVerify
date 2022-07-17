const request = require('supertest');
const { app } = require('../src/app');

describe('POST -/addAdmin', () => {
  const data = {
    username: 'admin',
    password: 'admin',
  };
  it('Should add admin to Admin table', async () => {
    await request(app).post('/deleteAdmin').send(data);
    const response = await request(app).post('/addAdmin').send(data);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      message: 'admin can now register students!',
    });
  });
});

describe;

// describe('POST -/findAdmin', () => {
//   const data = {
//     username: 'admin',
//     password: 'admin',
//   };
//   it('Should find admin in Admin table', async () => {
//     await request(app).post('/addAdmin').send(data);
//     const response = await request(app).post('/findAdmin').send(data);
//     console.log(response.body);
//     expect(response.status).toEqual(200);
//     expect(response.body).toEqual({
//       username: 'admin',
//       password: 'admin',
//     });
//   });
// });

describe('POST -/deleteAdmin', () => {
  it('Should delete admin from Admin table', async () => {
    const data = {
      username: 'admin',
      password: 'admin',
    };
    const response = await request(app).post('/deleteAdmin').send(data);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      message: 'Admin deleted',
    });
  });
});
