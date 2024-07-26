import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
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

export default mongoose.model<ICategory>("Category", CategorySchema);
