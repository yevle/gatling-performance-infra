FROM node

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN apt-get update &&\
    apt-get install -yq chromium xvfb

WORKDIR /lighthouse
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY resources resources
COPY .env .env
COPY test.js test.js
COPY src src
RUN mkdir report
RUN npm install 
