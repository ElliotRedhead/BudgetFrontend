FROM node:14-alpine3.15
WORKDIR /frontend
ENV PATH /frontend/node_modules/.bin:$PATH
COPY package.json yarn.lock /frontend/
COPY . /frontend/
RUN NODE_OPTIONS="--max-old-space-size=8192"
RUN yarn install
EXPOSE 3000