d3.csv('driving.csv', d3.autoType).then(data=>{

    const margin = ({top: 50, right: 50, bottom: 50, left: 50})
    const width = 1050 - margin.left - margin.right,
    height = 1050 - margin.top - margin.bottom;

    const svg = d3.select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g");

    const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.miles), d3.max(data, d => d.miles)])
    .range([50, width])
    .nice();

    const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.gas), d3.max(data, d => d.gas)])
    .range([height, 50])
    .nice();

    const xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5);

    const yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(10, "$.2f");

    const axisGroup1 = svg.append('g')
    .attr('class', 'axis y-axis')
    .attr('transform','translate(50, 0)')
    .call(yAxis);

    axisGroup1.selectAll('.tick line')
    .clone()
    .attr('x2', width)
    .attr('stroke-opacity', 0.1);

    axisGroup1.call(yAxis)
    .call(g => g.select('.domain').remove())
    .call(g =>
        g.append('text')
        .text('Cost per gallon')
        .attr('x', '115')
        .attr('y', '55')
        .attr('fill', 'black')
        .call(halo));

    const axisGroup2 = svg.append('g')
    .attr('class', 'axis x-axis')
    .attr('transform','translate(0, 950)')
    .call(xAxis);

    axisGroup2.selectAll('.tick line')
    .clone()
    .attr('y2', -height+50)
    .attr('stroke-opacity', 0.1);

    axisGroup2.call(xAxis)
    .call(g => g.select('.domain').remove())
    .call(g =>
        g.append('text')
        .text('Miles per gallon per year')
        .attr('x', '900')
        .attr('y', '-10')
        .attr('fill', 'black')
        .call(halo));

    const line = d3.line()
    .x(d => xScale(d.miles))
    .y(d => yScale(d.gas));

    svg.append("path")
    .datum(data)
    .attr("stroke", "black")
    .attr("stroke-width", 5)
    .attr("fill", "none")
    .attr("d", line);

    svg.selectAll('circle')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'circles')
    .append('circle')
    .attr('cx', d => xScale(d.miles))
    .attr('cy', d => yScale(d.gas))
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "white")
    .attr('r', 5);

    svg.select('.circles')
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', d => xScale(d.miles))
    .attr('y', d => yScale(d.gas))
    .text(d => d.year)
    .each(position)
    .call(halo);

});

function position(d) {
    const t = d3.select(this);
    switch (d.side) {
      case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
      case "right":
        t.attr("dx", "0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "start");
        break;
      case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
      case "left":
        t.attr("dx", "-0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "end");
        break;
    }
  }

  function halo(text) {
    text
      .select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
  }