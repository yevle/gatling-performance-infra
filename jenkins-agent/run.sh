#!/bin/sh

JENKINS_AGENT_NAME="agent1";
JENKINS_SECRET="2519bdf6a638bf8e4727a86e03bf37ff2810647ec6886821e9361c6711aef804";
JENKINS_URL="http://jenkins:8080";
JENKINS_AGENT_WORKDIR="/home/jenkins";

sleep 9
curl -sO $JENKINS_URL/jnlpJars/agent.jar
java -jar agent.jar -url $JENKINS_URL -secret $JENKINS_SECRET -name $JENKINS_AGENT_NAME -workDir "$JENKINS_AGENT_WORKDIR"