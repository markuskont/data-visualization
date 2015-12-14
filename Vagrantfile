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

$elasticsearch = <<SCRIPT

if [ -z `apt-cache policy elasticsearch | grep (none)` ]; then
  sudo wget -O - http://packages.elasticsearch.org/GPG-KEY-elasticsearch | apt-key add -
  sudo echo 'deb http://packages.elasticsearch.org/elasticsearch/1.7/debian stable main' | tee /etc/apt/sources.list.d/elasticsearch.list
  sudo apt-get update
  sudo apt-get install -y openjdk-7-jre-headless elasticsearch < /dev/null
  
  sudo update-rc.d elasticsearch defaults
  
  sudo echo 'http.cors.allow-origin: "/.*/"' >> /etc/elasticsearch/elasticsearch.yml
  sudo echo 'http.cors.enabled: true' >> /etc/elasticsearch/elasticsearch.yml
  
  sudo echo 'ES_HEAP_SIZE=512m' >> /etc/default/elasticsearch
  
  sudo service elasticsearch stop
  sudo service elasticsearch start
  
  sudo /usr/share/elasticsearch/bin/plugin -install mobz/elasticsearch-head
fi
SCRIPT

$es_load_data = <<SCRIPT
cd /tmp
sudo apt-get install unzip
wget -q -O datasets.zip https://github.com/stormpython/Elasticsearch-datasets/archive/master.zip
unzip datasets.zip

curl -XDELETE localhost:9200/*

curl -XPOST localhost:9200/nfl?pretty
curl -XPUT localhost:9200/nfl/2013/_mapping?pretty -d @/tmp/Elasticsearch-datasets-master/mappings/nfl_mapping.json
curl -XPOST localhost:9200/nfl/2013/_bulk?pretty --data-binary @/tmp/Elasticsearch-datasets-master/datasets/nfl_2013.json
SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.synced_folder ".", "/var/www/d3"
  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--memory", "1024"]
  end
  config.vm.define "frontend" do |frontend|
    frontend.vm.hostname = "frontend"
    frontend.vm.network "private_network", 
      ip: "192.168.56.10"
    frontend.vm.provision "shell", 
      inline: $webserver
  end
  config.vm.define "es" do |es|
    es.vm.hostname = "es"
    es.vm.network "private_network", 
      ip: "192.168.56.11"
    es.vm.provision "shell",
      inline: $elasticsearch
    es.vm.provision "shell",
      inline: $es_load_data
  end
end