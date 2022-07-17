// const fs = require('fs');
const {
  selectCertificate,
  calcExpireDay,
  // comparePassword,
} = require('../src/utils');

// jest.mock('fs');

describe('Test selectCertificate function', () => {
  it('Should select certificate based in course name', () => {
    expect(selectCertificate('BLSD')).not.toBeUndefined();
    // expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();
  });
});

describe('Test calcExpireDay function', () => {
  it('Should calculate expiration after 3 years', () => {
    expect(calcExpireDay('2022-01-01')).toEqual('01/01/2025');
  });
});

// describe('Test comparePassword function', () => {
//   it('Should compare if password is identic with hashed one', () => {

//   });
// });
