### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:14-alpine as builder

COPY package.json ./
COPY package-lock.json ./

RUN apk add --no-cache git
RUN git --version

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm install -g angular
## RUN NODE_ENV=development npm i && mkdir /ng-app && mv ./node_modules ./ng-app
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app

COPY ./ /ng-app/

## Build local the angular app in production mode and store the artifacts in dist folder
RUN ./node_modules/.bin/ng build --configuration=production --output-path=dist --base-href /generativesam20

# ## PIPE line mct Build the angular app in production mode and store the artifacts in dist folder
# RUN $(npm bin)/ng build --configuration=production --output-path=dist --base-href /generativesam20
## Run kendo license
COPY kendo-ui-license.txt ./
RUN npm install --save @progress/kendo-licensing && npx kendo-ui-license activate



### STAGE 2: Setup ###

FROM nginx:1.14.1-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
