import mongoose from "mongoose";
import Category from "./models/Category";
import Post from "./models/Post";
import Tag from "./models/Tag";
import User from "./models/User";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/blog_api";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Tag.deleteMany({});
    await Post.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: "adminpassword",
      role: "admin",
    });

    // Create categories
    const categories = await Category.create([
      { name: "Technology", slug: "technology" },
      { name: "Travel", slug: "travel" },
      { name: "Food", slug: "food" },
    ]);

    // Create tags
    const tags = await Tag.create([
      { name: "JavaScript", slug: "javascript" },
      { name: "NodeJS", slug: "nodejs" },
      { name: "MongoDB", slug: "mongodb" },
    ]);

    // Create sample posts
    await Post.create([
      {
        title: "Getting Started with Node.js",
        slug: "getting-started-with-nodejs",
        content: "This is a sample post about Node.js...",
        excerpt: "Learn the basics of Node.js in this introductory post.",
        author: adminUser._id,
        categories: [categories[0]._id],
        tags: [tags[1]._id],
        isPublished: true,
      },
      {
        title: "MongoDB Basics",
        slug: "mongodb-basics",
        content: "Learn the basics of MongoDB...",
        excerpt:
          "Discover the fundamentals of MongoDB in this comprehensive guide.",
        author: adminUser._id,
        categories: [categories[0]._id],
        tags: [tags[2]._id],
        isPublished: true,
      },
    ]);

    console.log("Seed data created successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
