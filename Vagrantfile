# -*- mode: ruby -*-
# vi: set ft=ruby :

$webserver = <<SCRIPT

echo "Installing packages"
sudo apt-get update
sudo apt-get install -y apache2 < /dev/null

echo "Reconfiguring default vhost with vagrant root dir (mounted with synced_folder parameter)"
sudo sed -i 's/\\/var\\/www\\/html/\\/var\\/www\\/d3/g' /etc/apache2/sites-enabled/000-default.conf
sudo service apache2 restart

SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.synced_folder ".", "/var/www/d3"
  config.vm.provider :virtualbox do |vb|
      vb.customize ["modifyvm", :id, "--memory", "1024"]
  end
  config.vm.define "server" do |server|
        server.vm.hostname = "server"
        server.vm.network "private_network", 
          ip: "192.168.56.10"
        server.vm.provision "shell", 
          inline: $webserver
  end
#  config.vm.define "client" do |client|
#        client.vm.hostname = "client"
#        client.vm.network "private_network", 
#          ip: "192.168.56.11"
#        client.vm.provision "shell", 
#          inline: $rsyslog_client
#  end

end