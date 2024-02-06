#!/bin/sh

JENKINS_AGENT_NAME="agent-lighthouse";
JENKINS_SECRET="fd37bf4c8670263f2cb00b1e803084e09ad4a841526c68a272c49bce603701ba";
JENKINS_URL="http://jenkins:8080";
JENKINS_AGENT_WORKDIR="agent/";

sleep 9
curl -sO $JENKINS_URL/jnlpJars/agent.jar
java -jar agent.jar -url $JENKINS_URL -secret $JENKINS_SECRET -name $JENKINS_AGENT_NAME -workDir "$JENKINS_AGENT_WORKDIR"