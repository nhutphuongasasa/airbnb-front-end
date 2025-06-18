FROM node:20-slim

# Cài các gói cần thiết để build native module
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  libcairo2-dev \
  libjpeg-dev \
  libpango1.0-dev \
  libgif-dev \
  librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Gỡ sharp nếu cài sẵn
RUN npm uninstall sharp || true

# Cài lại sharp theo đúng môi trường build
RUN npm install --platform=linux --arch=x64 sharp

# Cài lại các package còn lại
RUN npm install

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
