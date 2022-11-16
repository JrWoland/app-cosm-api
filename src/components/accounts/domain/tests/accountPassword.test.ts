import { AccountPassword } from '../AccountPassword';

it('Should not be able to create password with less than 8 chars.', () => {
  const accPassword = AccountPassword.create({
    value: '1234',
  });
  expect(accPassword.error).toEqual('Password does not meet criteria, min 8 chars.');
  expect(() => {
    accPassword.getValue();
  }).toThrowError();
});

it('Should create password.', () => {
  const accPassword = AccountPassword.create({
    value: '12345678',
  });
  expect(accPassword.isSuccess).toEqual(true);
  expect(accPassword.isFailure).toEqual(false);
  expect(accPassword.getValue().hashed).toEqual(true);
});

it('Should check if hashed and plain passwords are the same.', () => {
  const plainPassword = '12345678';
  const plainPassword2 = '87654321';

  const hashedPassword = AccountPassword.create({
    value: plainPassword,
  }).getValue().value;

  const arePasswordsTheSame = AccountPassword.comparePassword(hashedPassword, plainPassword);
  expect(arePasswordsTheSame).toEqual(true);

  const arePasswordsTheSame2 = AccountPassword.comparePassword(hashedPassword, plainPassword2);
  expect(arePasswordsTheSame2).toEqual(false);
});
