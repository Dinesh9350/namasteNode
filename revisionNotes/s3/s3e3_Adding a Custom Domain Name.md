# Episode-03 - Adding a Custom Domain Name

Purchase domain name on Godaddy
signup on cloudfare & add a new domain name
change the nameserves on Godaddy and point to cloudfare
wait for 15 min for nameserves to be updated on Cloudfare
DNS > Records -> add/edit record -> copy EC2 ip and paste on which my apps are running

Now website is hosted in devtinder.in

to Add SSL:
SSL/TLS/overview:
SSL/TLS -> configure -> Custom SSL/TLS -> flexible
SSL/TLS/edge certificates:
Automatic HTTPS Rewrites -> keep it enbale

