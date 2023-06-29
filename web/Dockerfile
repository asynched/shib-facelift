FROM node:18-alpine as build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

EXPOSE 4173

CMD ["pnpm", "preview", "--host", "0.0.0.0"]
