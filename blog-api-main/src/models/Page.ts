import mongoose, { Document, Schema } from "mongoose";

export interface IPage extends Document {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  thumbnail?: string;
}

const PageSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
    thumbnail: { type: String },
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

export default mongoose.model<IPage>("Page", PageSchema);
