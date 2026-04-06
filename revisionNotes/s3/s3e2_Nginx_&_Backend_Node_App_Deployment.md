## Episode-02 - Nginx & Backend Node App Deployment

nginx listens on port 80

backend deploy in Aws

ssh -i "devtinder-securet.pem" ubuntu@ec2-13-63-161-199.eu-north-1.compute.amazonaws.com
cd NamasteNode

on local:
[Update Password if required]
npm run dev
DB cannot be connected! (because password changed)
generate a new password
mogdb atlas -> db access -> edit -> autogenerate password
database.js change password
git push

=========================

in terminal:
cd namasteNode
git pull
npm i
npm run start
DB cannot be connected!
DB cannot be accessed from anywhere, so to allow that go to network access -> add -> allow access from anywhere (but this is risky)
Instead, copy Aws ec2 ip and paste it in ip
server is runnning at PORT 4000
http://3.238.131.227/ this will work http://3.238.131.227:4000 this will not, to allow this
EC2 -> security -> groups -> add rule -> port 4000, 0.0.0.0/0 -> save
http://3.238.131.227:4000 - namaste node code will run on this port
but it'll be closed if i stop npm run start, the issue is npm run start will automatically stop after sometime
To keep it running we use PM2
npm install pm2 -g
pm2 start npm -- start (it'll keep running 24/7)
To give process a name
pm2 start npm --name "devtinder-backend" -- start
pm2 logs
pm2 flush <name> (clear logs)
pm2 stop <name> (stop backed)
pm2 delete <name> (delete process)
now api will call in the frontend app
http://3.238.131.227/
but api call is happening on http://localhost:4000/user/feed
it should not be localhost it should be the ip

=========================

Frontend = http://3.238.131.227
Backend = http://3.238.131.227:4000
Domain = devtinder.com
Frontend = devtinder.com
Backend = devtinder.com/api

http://3.238.131.227:4000 -> not found

chatgpt:
nginx proxy pass /api to 4000 node app

sudo nano /etc/nginx/sites-available/default
```js
server_name 3.238.131.227;

location /api/ {
  proxy_pass http://localhost:4000/;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```
sudo systemctl restart nginx
http://3.238.131.227:/api/feed
it'll work now

=========================

Connection frontend to Backend

Frontend
constants.js
export const BASE_URL = "http://localhost:4000";
to
export const BASE_URL = "/api";

in terminal:
go to frontend repo and git pull
again deploy frontend 
npm run build
sudo scp -r dist/* /var/www/html/


