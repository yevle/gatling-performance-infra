FROM influxdb:1.8.10

COPY entrypoint1.sh /entrypoint1.sh
COPY /conf/. /etc/influxdb/

ENTRYPOINT ["/entrypoint1.sh"]
