import mongoose from 'mongoose';

export interface TreatmentDocModel {
  _id: string;
  account_id: string;
  name: string;
  notes?: string;
  duration?: number;
  price?: { value?: number; currency?: string };
  treatment_card_id?: string;
  created_at?: Date;
  updated_at?: Date;
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
        type: Number,
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
