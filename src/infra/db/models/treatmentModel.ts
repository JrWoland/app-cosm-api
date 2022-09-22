import mongoose from 'mongoose';

export interface TreatmentDocModel {
  _id: string;
  account_id: string;
  name: string;
  notes: string;
  duration: string;
  price: { value: string; currency: string };
  treatmentCardId: string; // 1 or 2
}

const treatmentScheema = new mongoose.Schema<TreatmentDocModel>(
  {
    _id: {
      type: String,
      required: true,
    },
    account_id: {
      type: String,
      required: true,
      ref: 'Account',
    },
    name: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    duration: {
      type: Number, //minutes
      required: false,
    },
    price: {
      value: {
        type: String,
        required: false,
      },
      currency: {
        type: String,
        required: false,
      },
    },
    treatmentCardId: {
      type: String,
      required: false,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const TreatmentModel = mongoose.model<TreatmentDocModel>('Treatment', treatmentScheema);

export { TreatmentModel };
