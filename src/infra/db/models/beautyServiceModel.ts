import mongoose from 'mongoose';

const BeautyServicesTypes = {
  LASHES: 'LASHES',
  NAILS: 'NAILS',
};

export const beautyServiceScheema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: BeautyServicesTypes.LASHES,
      enum: {
        values: [BeautyServicesTypes.LASHES, BeautyServicesTypes.NAILS],
        message: '{VALUE} is not supported',
      },
    },
    expires: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const BeautyServiceModel = mongoose.model('BeautyService', beautyServiceScheema);
