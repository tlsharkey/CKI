FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Copy files from current directory
COPY . .

# expose port data
EXPOSE 8000

# run
CMD ["npm", "start"]
