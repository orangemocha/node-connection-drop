node-connection-drop
====================

Node.js websocket connection drop on v0.10.26 seen as load increases

## Problem Description ##
Demonstrates an issue with a Node.js 0.10.26 64 bit based server where a high rate of disconnects cause a sharp drop in the number
of active connections maintained by the server. The server also becomes unresponsive until the load is reduced and does not accept new connections. 
This is seen on Windows Server 2012 running on Windows Azure but I haven't tried it on other platforms yet.   

Server.js is a plain https node.js based server that runs socket.io without any special configuration. 

## Usage ##

### Installing ###
'npm install'

### Running the test ###

Run server (by default runs on port 443):

node server.js

Run client from different machines than the server 

node client.js url_to_server

## Problem repro ##
Each run of client.js attempts to maintain 2000 websocket connections with the server url specified. Each connection 
disconnects after 3 minutes and the client program starts new connections upto the max number to keep a constant load. 
The load test runs continuously.

* In order to reproduce this problem run client.js on separate machines. A ramp up traffic pattern seen in production 
can be simulated by starting a new run after few seconds of the previous one. 

### Observations on server with node 0.8.12 ###

On the machine running server.js I used perfmon to capture the system reported TCPv4\Connections Established and Working Set of node.exe process

Node 0.8 graphs look as expected as 4 runs of clients started one after the another load the server up to 8k connections.
Each connection also disconnects after 3 minutes but it does not reflect in Connections Established counter because the 
counter also shows those TCP sockets that are in CLOSE_WAIT state and new connections are started quickly by client.js.

![node0.8](https://raw.githubusercontent.com/prateekmr/node-connection-drop/master/report/Node0.8_Connections.jpg)

### Observations on server with node 0.10.26 ###
The system behaves well till the same test is repeated with 8000 connections however as the 5th batch is added the server 
begins to loose connections and becomes unresponsive till all load is not removed.

![node0.10](https://raw.githubusercontent.com/prateekmr/node-connection-drop/master/report/Node0.10_Connections.jpg)
