// API's configuration

d3.json(
    'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  )
    .then(data => {
  
      const gdpData = data.data.map(entry => entry[1]);
      const years = data.data.map(entry => entry[0].substring(0, 4));
      const fullYears = data.data.map(entry => entry[0]); // Guardar la fecha completa
      const product = data.data.map(entry => Math.floor(entry[1]));
  
      const divContainer = d3.select('body')
                              .append('div')
                              .classed('container', true)
                              .append('h1')
                              .attr('id', 'title')
                              .text('United States GDP');
    
      const designedBy = d3.select('body')
                           .append('div')
                           .append('h4')
                           .text('Designed by Juan Valenzuela')                    
      
      const tooltip = d3.select('body')
                        .append('div')
                        .attr('id', 'tooltip')
                        .style('position', 'absolute')
                        .style('visibility', 'hidden')
                        .style('background-color', '#1d2b39')
                        .style('border', '1px solid ##1d2b39')
                        .style('padding', '10px')
                        .style('border-radius', '4px')
                        .style('box-shadow', '0 2px 4px rgba(0,0,0,0.2)')
                        .style('pointer-events', 'none')
                        .attr('class', 'tooltip')
                        .style('color', 'white')
  
      const svgWidth = 800;
      const svgHeight = 400;
      const padding = 50; // Ajustar este valor según sea necesario
  
      const yearRange = years
        .filter((year, i, arr) => {
          if (year.endsWith('0') || year.endsWith('5')) {
            return i === 0 || year !== arr[i - 1];
          }
          return false;
        });
  
      function round1000(num) {
        return Math.floor(num / 2000) * 2000;
      }
  
      const productRange = product.map(round1000).filter(value => value % 2000 === 0);
      console.log(productRange);
  
      const xScale = d3.scaleBand()
                       .domain(years)
                       .range([padding, svgWidth - padding]);
  
      const yScale = d3.scaleLinear()
                       .domain([0, 18000]) // Asegurando que el dominio vaya desde 0 hasta 18000
                       .range([svgHeight - padding, padding]);
  
      const svg = divContainer.append('svg')
                              .attr('width', svgWidth)
                              .attr('height', svgHeight);
  
      const barWidth = (svgWidth - 2 * padding) / gdpData.length;
      const barHeightScale = d3.scaleLinear()
                                .domain([0, d3.max(gdpData)])
                                .range([0, svgHeight - 2 * padding]);
  
      svg.selectAll('rect')
         .data(data.data)
         .enter()
         .append('rect')
         .attr('x', (d, i) => padding + i * barWidth)
         .attr('y', d => yScale(d[1]))
         .attr('class', 'bar')
         .attr('width', barWidth * 0.9)
         .attr('height', d => svgHeight - padding - yScale(d[1]))
         .attr('fill', '#1d2b39')
         .attr('data-date', d => d[0]) // Agregar atributo data-date
         .attr('data-gdp', d => d[1])  // Agregar atributo data-gdp
         .on('mouseover', function(event, d) {
            tooltip.style('visibility', 'visible')
                   .attr('data-date', d[0]) // Establecer data-date del tooltip
                   .text(`Year: ${d[0].substring(0, 4)}, GDP: ${d[1]}`);
          })
          .on('mousemove', function(event) {
            tooltip.style('top', `${event.pageY - 10}px`)
                   .style('left', `${event.pageX + 10}px`);
          })
          .on('mouseout', function() {
            tooltip.style('visibility', 'hidden');
          });
  
  
      const xAxis = d3.axisBottom(xScale).tickValues(yearRange);
      const yAxis = d3.axisLeft(yScale).tickValues(d3.range(0, 18001, 2000)); // Ticks cada 2000
  
      svg.append('g')
         .attr("transform", `translate(0, ${svgHeight - padding})`)
         .attr('id', 'x-axis')
         .call(xAxis)
         .selectAll('text')
         .style('text-anchor', 'end');
  
      svg.append('g')
         .attr("transform", `translate(${padding}, 0)`)
         .attr('id', 'y-axis')
         .call(yAxis);
  
    })
    .catch(error => {
      console.error('Error al cargar los datos:', error);
    });
  