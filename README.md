# ZStack-VDI project

## Environment Preparations

- Install the latest LTS version of Node.js (Recommended version: 14 or later)
- [Install yarn](https://yarnpkg.com/)


## Getting Started

```bash
# clone project
$ git clone git@github.com:zstackio/zstack-vdi.git
$ cd zstack-vdi

# Install dependencies
$ yarn

# Run 
$ yarn start

# build
$ yarn build
```


## Deploy

Deploy the VDI service


1. Download the dist file or build a dist file. Then copy the dist file to the specified directory of the ZStack Cloud management node: */root/zstack-vdi/* . If you do not specify this directory, modify the *zstack.vdi.nginx.conf* file as needed.
2. Copy the Nginx configuration file *script/zstack.vdi.nginx.conf* to the directory */root/zstack-vdi/*.
   ```bash
    server {
        listen 8888;
        location / {
            gzip on;
            gzip_comp_level 6;
            gzip_vary on;
            gzip_types text/plain text/css application/json application/x-javascript application/javascript text/xml application/  xml application/rss+xml text/javascript image/svg+xml application/vnd.ms-fontobject application/x-font-ttf font/opentype;
            alias /root/zstack-vdi/dist/;
            try_files $uri @index;
            expires -1;
            etag on;
        }
        location @index {
            root /root/zstack-vdi/dist;
            index index.html;
            add_header Cache-Control no-cache;
            expires -1;
            try_files /index.html =404;
        }
        location /zstack/v1 {
            proxy_http_version 1.1;
            proxy_connect_timeout 4s;
            proxy_read_timeout 3600s; 
            proxy_send_timeout 3600s;
            proxy_pass  http://localhost:8080; # If the VDI service is not deployed on the management node, you need to install the Nginx service and change httpt://localhost:8080 to httpt://$MN_IP:8080
        }
    }
   ```
3. After the preceding building process is completed, copy the dist file to a specified directory, such as /root/zstack-vdi/dist. 
4. Modify the listener port in the *script/zstack.vdi.nginx.conf* file as needed. For example, in the configuration file, the port is 8888.
5. If you deploy the VDI service on the ZStack Cloud management node, you must open the preceding port. The default path is */etc/sysconfig/iptables*.

    Add the following rule in the iptables configuration file and then restart iptables. 
    ```bash
    $ -A INPUT -p tcp -m tcp --dport 8888 -j ACCEPT
    ```
6. Run the following command
    ```bash
    $ /usr/sbin/nginx -c /root/zstack-vdi/zstack.vdi.nginx.conf
    ```
7. Visit the VDI management platform
    ```
    Enter the following URL in the address bar of a browser: http://ip:8888
    ```
