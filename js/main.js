define(['lib/js/d3', 'lib/js/elasticsearch'], function (d3, elasticsearch) {
    "use strict";
    var client = new elasticsearch.Client({
    	host: {
    		protocol: 'http',
    		host: '192.168.56.11',
    		port: '9200'
		}
    });
    client.search({
        index: 'nfl',
        size: 5,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: { match: { "description": "TOUCHDOWN" }},
                    must_not: { match: { "qtr": 5 }}
                }
            },
            // Aggregate on the results
            aggs: {
                touchdowns: {
                    terms: {
                        field: "qtr",
                        // order by quarter, ascending
                        order: { "_term" : "asc" }
                    }
                }
            }
            // End query.
        }
    }).then(function (resp) {
        console.log(resp);
        // D3 code goes here.
        var touchdowns = resp.aggregations.touchdowns.buckets;
        // d3 donut chart
        var width = 600,
            height = 300,
            radius = Math.min(width, height) / 2;
        var color = ['#ff7f0e', '#d62728', '#2ca02c', '#1f77b4'];
        var arc = d3.svg.arc()
            .outerRadius(radius - 60)
            .innerRadius(120);
        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) { return d.doc_count; });
        var svg = d3.select("#donut-chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width/1.4 + "," + height/2 + ")");
        var g = svg.selectAll(".arc")
            .data(pie(touchdowns))
            .enter()
            .append("g")
            .attr("class", "arc");
        g.append("path")
            .attr("d", arc)
            .style("fill", function (d, i) { return color[i]; });
        g.append("text")
            .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .text(function (d) { return d.data.key; });
    });
});