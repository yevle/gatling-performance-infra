FROM jenkins/ssh-agent:latest-jdk11

ENV JENKINS_AGENT_SSH_PUBKEY "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCn6IRYknCe3iosWDfKOSv0XovQMbah7CvWhX0jG6ynBf3Gw21noqcxrPyFrouDC50xoBduW5srtqpY894vuDlsWMOuWwPYkds7v0ZwhhjDed1wxI/7R05p+K+48Icb1sdLscZjKAnbt4YwuugquZsqQE2esjPPfe7jg/4fkVXbNeBU3oj/QCTiw6OtotkbeKJ77IalxDaWGrmUqeL5DkSPj9gWrwixhwib/sHvV3nmaG1W54WnGIjpa+X45TMN+PHn0fS5q9kmGD2WlIcOvaTkJJMvr6/aNuEZBvJZDFtm1nzI6lyPTYMRe0EBgJwVqL+p2Gi9EJKLsZMlXDihye5ZHLQgfWuklJAr4J07YEa9cdk2sIhKc793WZ5V+odv4QXD0ys5W2yJtBEeS+iifoygeTGs/uTGPdrmGrw5xLhPgBP900FTiu7GotCPP1+rdL3LkqWSwjL456zhQ1ZMAQi1Yc9w57vgpH2um50VH4uS5oZaEI8g8U2jvaggjh+tkH0="

RUN apt-get -y update && apt-get upgrade -y && \
    apt-get install -y curl bash unzip && \
    curl -fsSL https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz -o /tmp/apache-maven.tar.gz \
    && tar -zxvf /tmp/apache-maven.tar.gz -C /tmp \
    && mv /tmp/apache-maven-3.9.6 /usr/local/apache-maven \
    && ln -s /usr/local/apache-maven/bin/mvn /usr/local/bin/mvn \
    && rm /tmp/apache-maven.tar.gz