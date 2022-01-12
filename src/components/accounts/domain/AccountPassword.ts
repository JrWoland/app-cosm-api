import bcrypt from 'bcrypt';
import { Result } from '../../../core/logic/Result';

interface AccountPasswordProps {
  value: string;
}

export class AccountPassword {
  constructor(private props: AccountPasswordProps) {}

  get value() {
    return this.props.value;
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
      return Result.fail<AccountPassword>('Password does not meet criteria, min 8 chars');
    } else {
      return Result.ok<AccountPassword>(new AccountPassword({ value: this.hashPassword(props.value) }));
    }
  }
}
