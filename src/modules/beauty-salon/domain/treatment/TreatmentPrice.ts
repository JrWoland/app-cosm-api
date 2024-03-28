import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

export class TreatmentPrice extends ValueObject<number> {
  private static minPrice = 0;

  private constructor(private price: number) {
    super(price);
  }

  public get value() {
    return this.price;
  }

  public static create(price: number): TreatmentPrice {
    if (isNaN(Number(price))) {
      throw new UnprocessableEntityException(`Treatment price must be a number. Provided value: ${price}`);
    }
    if (price < this.minPrice) {
      throw new UnprocessableEntityException(`Treatment price can not be less than ${this.minPrice}.`);
    }
    return new TreatmentPrice(price);
  }
}
