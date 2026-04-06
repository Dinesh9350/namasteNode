## Episode-01 - Launching a AWS Instance and deploying frontend

- go to EC2
- create Key .pem file
- Launch EC2 instance
- connect, go to ssh client

- Open Terminal, go to the path where .pem was downloaded
- chmod 400 "devtinder-securet.pem" (key to acceess the server)
- ssh -i "devtinder-securet.pem" ubuntu@ec2-13-63-161-199.eu-north-1.compute.amazonaws.com (key used to go into machine)

Now were inside the server
Machine setup

- download Node.js
- Download and install nvm:
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
  exit from server
- in lieu of restarting the shell or (restarting server) both are same
  \. "$HOME/.nvm/nvm.sh"
- Download and install Node.js:
  nvm install 22.16.0 (project node version)
  node -v

  git clone https://github.com/Dinesh9350/devTinderWeb.git (frontend)
  git clone https://github.com/Dinesh9350/namasteNode.git (backend)

  ls

  //Deploying Frontend
  cd devTinderWeb
  npm i
  npm run build
  ls

  NGINX - to host frontend into server
  sudo apt update
  sudo apt install nginx
  sudo systemctl start nginx (to start nginix in system)
  sudo systemctl enable nginx
  //copy code from dist(build files) to http server repo of nginix
  //copy code from dist(build files) to /var/www/html/
  cd /var/www/html/
  cd (going out from everywhere)
  cd devTinderWeb
  sudo scp -r dist/* /var/www/html/
  cd /var/www/html/
  ls

  go back to EC2 instance and search public ip
  Public IPv4 address
  assign port to the ip: 80
  instance > security > security groups > edit inbound rule > add rule
  custom TCP 
  port range: 80
  Anywhere
  search -> 0.0.0.0/0
  save rules

  http://<ip>

  https will not work

