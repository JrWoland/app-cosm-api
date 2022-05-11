import bcrypt from 'bcrypt';
import { ValueObject } from '../../../core/domain/ValueObject';
import { Result } from '../../../core/logic/Result';

interface AccountPasswordProps {
  value: string;
  hashed?: boolean;
}

export class AccountPassword extends ValueObject<AccountPasswordProps> {
  private constructor(private accountProps: AccountPasswordProps) {
    super(accountProps);
  }

  get value() {
    return this.accountProps.value;
  }

  get hashed() {
    return this.accountProps.hashed;
  }

  private static hashPassword(password: string): string {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }

  public static isAppropriateLength(value: string): boolean {
    return value.length >= 8;
  }

  public static comparePassword(hashedPassword: string, plainPassword: string): boolean {
    const arePasswordsTheSame = bcrypt.compareSync(plainPassword, hashedPassword);
    return arePasswordsTheSame;
  }

  public static create(props: AccountPasswordProps) {
    if (!this.isAppropriateLength(props.value)) {
      return Result.fail<AccountPassword>('Password does not meet criteria, min 8 chars.');
    }

    const passwordToProvide = props.hashed ? props.value : this.hashPassword(props.value);

    return Result.ok<AccountPassword>(new AccountPassword({ value: passwordToProvide, hashed: true }));
  }
}
