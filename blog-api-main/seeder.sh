#!/bin/sh

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until nc -z mongo 27017
do
    echo "MongoDB is unavailable - sleeping"
    sleep 1
done

echo "MongoDB is up - executing command"

# Run the seed script
echo "Running seed script..."
node dist/seed.js

echo "Seeding completed."