FROM jenkins/inbound-agent:latest-jdk17

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY run.sh /run.sh

USER root

RUN apt-get -y update && apt-get upgrade -y && \
    apt-get install -y nodejs npm && \
    apt-get install -yq chromium xvfb

ENTRYPOINT ["bash","-x","/run.sh"]