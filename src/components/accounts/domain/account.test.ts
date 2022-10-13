import { Account } from './Account';
import { AccountPassword } from './AccountPassword';

it('Should succesfully create account.', () => {
  const email = 'test@test.com';
  const accPassword = AccountPassword.create({
    value: '12345678',
  });

  const account = Account.create({
    email: 'test@test.com',
    password: accPassword.getValue(),
  });

  expect(account.isSuccess).toEqual(true);
  expect(account.isFailure).toEqual(false);
  expect(account.getValue().accountId).toBeTruthy();
  expect(account.getValue().password).toBeTruthy();
  expect(account.getValue().email).toEqual(email);
});
