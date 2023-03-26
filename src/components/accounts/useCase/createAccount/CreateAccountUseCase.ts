import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { CreateAccountDTO } from './CreateAccountDTO';
import { IAccountRepo } from '../../repo/AccountRepo';
import { AccountPassword } from '../../domain/AccountPassword';
import { Account } from '../../domain/Account';

type Response = Result<any>;
export class CreateAccountUseCase implements UseCase<CreateAccountDTO, Promise<Response>> {
  constructor(private accountRepo: IAccountRepo) {}

  public async execute(request: CreateAccountDTO): Promise<Response> {
    const { email, password } = request;

    const hashedPassword = AccountPassword.create({ value: password });

    const result = Account.create({ email: email, password: hashedPassword.getValue() });

    const accountExists = await this.accountRepo.exists(email);
    if (accountExists) {
      return Result.fail('Account already exists.');
    }

    const account = result.getValue();
    await this.accountRepo.save(account);

    return Result.ok('Account created.');
  }
}
