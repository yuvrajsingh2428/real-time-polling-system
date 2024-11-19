# Step 1: Use an official Node.js runtime image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the source code into the container
COPY . .

# Step 5: Expose the application's port
EXPOSE 4000

# Step 6: Start the application
CMD ["node", "src/index.js"]
