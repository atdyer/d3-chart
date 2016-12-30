var parseDate = d3.timeParse("%b %Y");
var linker = chart.linker();

d3.tsv("data/stocks.tsv", type, function ( error, data ) {

    if ( error ) throw error;

    var symbols = d3.nest()
        .key(function ( d ) {
            return d.symbol;
        })
        .entries(data);

    var domain = [
        d3.min(symbols, function ( symbol ) {
            return symbol.values[ 0 ].date;
        }),
        d3.max(symbols, function ( symbol ) {
            return symbol.values[ symbol.values.length - 1 ].date;
        })
    ];

    var width = d3.select('body')
        .node()
        .getBoundingClientRect().width;

    d3.select("#chart")
        .selectAll("div")
        .data(symbols)
        .enter()
        .append("div")
        .each(function ( d ) {

            var range = [ 0, d3.max(d.values, function(d) { return d.price; }) ];

            var c = chart()
                .width(width)
                .height(69)
                .margin({top: 8, right: 10, bottom: 2, left: 10})
                .domain(domain)
                .range(range)
                .x_scale(d3.scaleTime())
                .x(function ( d ) { return d.date; })
                .y(function ( d ) { return d.price; });

            c.area()
                .data(d.values)
                .attr('fill', '#e7e7e7');

            c.line()
                .data(d.values)
                .attr('stroke-width', 1.5)
                .attr('stroke', '#666')
                .hover(true);

            linker.link(c);

            var stamp = c(d3.select(this));

            stamp.append('text')
                .attr('x', c.width() - c.margin().left - c.margin().right - 6)
                .attr('y', c.height() - c.margin().top - c.margin().bottom - 6 )
                .attr('text-anchor', 'end')
                .style('font', '10px sans-serif')
                .text( d.key );

        });
});

function type( d ) {
    d.price = +d.price;
    d.date = parseDate(d.date);
    return d;
}