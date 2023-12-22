FROM --platform=linux/amd64 node

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH="/chrome/linux-119.0.6045.105/chrome-linux64/chrome"

RUN npx @puppeteer/browsers install chrome@119.0.6045.105
RUN apt-get update &&\
    apt-get install -yq xvfb libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon-x11-0 \
    libxcomposite1 libxdamage1 libgbm1 libasound2

WORKDIR /lighthouse
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY resources resources
COPY .env .env
COPY test.js test.js
COPY src src
RUN mkdir report
RUN npm install 
