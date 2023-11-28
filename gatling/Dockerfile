FROM eclipse-temurin:8-jdk

# working directory for gatling
WORKDIR /opt

# gating version
ENV GATLING_VERSION 3.9.5

# create directory for gatling install
RUN mkdir -p gatling

# install gatling
RUN apt-get -y update && apt-get upgrade -y && \
    apt-get install -y curl bash unzip && \
    apt-get install -y rsync && \
    mkdir -p /tmp/downloads && \
    curl -o "/tmp/downloads/gatling-$GATLING_VERSION.zip" \
    https://repo1.maven.org/maven2/io/gatling/highcharts/gatling-charts-highcharts-bundle/$GATLING_VERSION/gatling-charts-highcharts-bundle-$GATLING_VERSION-bundle.zip && \
    mkdir -p /tmp/archive && cd /tmp/archive && \
    unzip /tmp/downloads/gatling-$GATLING_VERSION.zip && \
    rsync -av /tmp/archive/gatling-charts-highcharts-bundle-$GATLING_VERSION/* /opt/gatling/ && \
    rm -rf /tmp/*
# Install InfluxDB Java client library
RUN mkdir -p /opt/gatling/lib && \
    curl -o "/opt/gatling/user-files/lib/influxdb-java-2.23.jar" \
    https://repo1.maven.org/maven2/org/influxdb/influxdb-java/2.23/influxdb-java-2.23.jar &&\
    curl -o "/opt/gatling/user-files/lib/converter-moshi-2.9.0.jar" \
    https://repo1.maven.org/maven2/com/squareup/retrofit2/converter-moshi/2.9.0/converter-moshi-2.9.0.jar &&\
    curl -o "/opt/gatling/user-files/lib/kotlin-stdlib-1.9.20.jar" \
    https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-stdlib/1.9.20/kotlin-stdlib-1.9.20.jar &&\
    curl -o "/opt/gatling/user-files/lib/logging-interceptor-4.10.0.jar" \
    https://repo1.maven.org/maven2/com/squareup/okhttp3/logging-interceptor/4.10.0/logging-interceptor-4.10.0.jar &&\
    curl -o "/opt/gatling/user-files/lib/moshi-1.8.0.jar" \
    https://repo1.maven.org/maven2/com/squareup/moshi/moshi/1.8.0/moshi-1.8.0.jar &&\
    curl -o "/opt/gatling/user-files/lib/okhttp-4.10.0.jar" \
    https://repo1.maven.org/maven2/com/squareup/okhttp3/okhttp/4.10.0/okhttp-4.10.0.jar &&\
    curl -o "/opt/gatling/user-files/lib/okio-jvm-3.6.0.jar" \
    https://repo1.maven.org/maven2/com/squareup/okio/okio-jvm/3.6.0/okio-jvm-3.6.0.jar &&\
    curl -o "/opt/gatling/user-files/lib/retrofit-2.9.0.jar" \
    https://repo1.maven.org/maven2/com/squareup/retrofit2/retrofit/2.9.0/retrofit-2.9.0.jar

COPY /conf/. /opt/gatling/conf
COPY /resources/. /opt/gatling/user-files/resources
COPY /simulations/. /opt/gatling/user-files/simulations
#COPY /lib/. /opt/gatling/user-files/lib
COPY entrypoint.sh /

# change context to gatling directory
WORKDIR  /opt/gatling

# set directories below to be mountable from host
VOLUME ["/opt/gatling/conf", "/opt/gatling/results", "/opt/gatling/user-files"]

# set environment variables
ENV PATH /opt/gatling/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV GATLING_HOME /opt/gatling

ENTRYPOINT ["bash","-x","/entrypoint.sh"]