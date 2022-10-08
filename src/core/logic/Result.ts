export class Result<T> {
  public isSuccess: boolean;

  public isFailure: boolean;

  public error: T | string | null;

  private _value: T;

  private constructor(isSuccess: boolean, error: T | string | null, value: T) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;
  }

  public getValue(): T {
    if (!this.isSuccess) {
      const errorMessage = String(this.error) || `Cant retrieve the value from a failed result.`;
      throw new Error(errorMessage);
    }

    return this._value;
  }

  public static ok<U>(value: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: any): Result<U> {
    return new Result<U>(false, error, error);
  }

  public static bulkCheck<U>(results: Result<U>[]) {
    const errors = results.some((i) => i.isFailure);

    if (!errors) {
      const messages = results.reduce((prev, curr) => (prev += curr.getValue()), '');
      return Result.ok(messages);
    }

    const mergedErrors = results
      .filter((i) => i.isFailure)
      .map((i) => i.error)
      .join('. ');
    return Result.fail<string>(mergedErrors);
  }
}
