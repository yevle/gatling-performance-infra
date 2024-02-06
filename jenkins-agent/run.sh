#!/bin/sh

JENKINS_AGENT_NAME="agent-gatling";
JENKINS_SECRET="d45504e2186a3a563708eb8265bb9ab51f51022c46279198050ebca9a50572f1";
JENKINS_URL="http://jenkins:8080";
JENKINS_AGENT_WORKDIR="agent/";

sleep 9
curl -sO $JENKINS_URL/jnlpJars/agent.jar
java -jar agent.jar -url $JENKINS_URL -secret $JENKINS_SECRET -name $JENKINS_AGENT_NAME -workDir "$JENKINS_AGENT_WORKDIR"