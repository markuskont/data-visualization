define(['elasticsearch'], function (elasticsearch) {
    "use strict";
    var client = new elasticsearch.Client({
    	host: {
    		protocol: 'http',
    		host: '192.168.56.11',
    		port: '9200'
		}
    });
    return client;
});