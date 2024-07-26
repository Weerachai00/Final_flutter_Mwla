import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
}

const BannerSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model<IBanner>("Banner", BannerSchema);
