import mongoose, { Document, Schema } from "mongoose";

export interface IMenuItem extends Document {
  id: string;
  title: string;
  url: string;
  order: number;
  parent?: mongoose.Types.ObjectId;
  children?: IMenuItem[];
}

const MenuItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
    parent: { type: Schema.Types.ObjectId, ref: "MenuItem" },
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

MenuItemSchema.virtual("children", {
  ref: "MenuItem",
  localField: "_id",
  foreignField: "parent",
});

const MenuItem = mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;
