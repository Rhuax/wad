# Stage 2

This stage consist of a simple ARP request to obtain an IP address given the Mac Address of the Intel Edison Board on which a webserver was installed (you can find the code of the server in the `iot-server` folder).

To pass from `fc:c2:de:34:42:7a` to a given ip, you have to exploit the ARP table of the router. So the first thing to do is a broadcast ping request (e.g. `ping 192.168.1.255`) to the network. 
After the request has succeded you can procede with the following command to retrieve the edison ip: `arp -al | grep fc:c2:de:34:42:7a`
N.B. Another solution could be to use a software like [nmap](https://nmap.org/) to discover local devices on the network.

After you have retrieved the ip you have to finally perform a POST request to the dev server. It could be done via [cURL](https://curl.haxx.se/), [Postman](https://www.getpostman.com/) or any HTTP request dev tool. Here's an example with cURL: `curl --request POST 'http://<discovered ip>:3030/winner' --data-urlencode "code=5-8,'|)" --data-urlencode "name=<your name>"`
