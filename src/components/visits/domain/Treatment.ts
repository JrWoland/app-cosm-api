import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';

type TreatmentsType = 'LASHES' | 'NAILS';
interface LashesTreatment {
  glue: string;
  remover: string;
}

interface NailsTreatment {
  length: string;
  colors: string;
}

export interface TreatmentProps {
  type: TreatmentsType;
  price: number;
  duration: number;
  notes: string;
  details: object;
}

export class Treatment extends AggregateRoot<TreatmentProps> {
  private constructor(props: TreatmentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: TreatmentProps, id: UniqueEntityID): Result<any> {
    throw new Error('Method not implemented.');
  }
}
