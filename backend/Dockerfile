FROM node:18

# Install Python and required libraries using apt to avoid PEP 668 issues
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-numpy python3-pandas python3-sklearn && \
    apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
