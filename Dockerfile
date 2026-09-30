FROM node:24-alpine
WORKDIR /frontend
COPY package.json package-lock.json /frontend/
RUN npm ci
COPY . /frontend/
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
