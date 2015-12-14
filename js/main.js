// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    d3: 'libs/d3/d3',
    elasticsearch: 'libs/elasticsearch/elasticsearch'
  }
});

require(['donut']);
require(['dendrogram']);