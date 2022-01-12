import mongoose from 'mongoose';

const BeautyServicesTypes = {
  LASHES: 'LASHES',
  NAILS: 'NAILS',
};

const beautyServiceScheema = new mongoose.Schema(
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
      default: function () {
        if (this.name === BeautyServicesTypes.LASHES) {
          return new Date(2100, 1, 1);
        } else {
          return Date.now();
        }
      },
    },
  },
  { timestamps: true },
);

const BeautyServiceModel = mongoose.model('BeautyService', beautyServiceScheema);

export { beautyServiceScheema };
