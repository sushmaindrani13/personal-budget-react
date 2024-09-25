import React from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import { useState,useEffect ,useRef} from 'react';
import * as d3 from 'd3';


function Homepage() {

    const [chartData, setChartData] = useState({
        datasets: [
          {
            data: [],
            backgroundColor: [
            ]
          }
        ],
        labels: []
      });


    const canvasRef = useRef(null); // Create a ref to hold the canvas element
    const chartInstanceRef = useRef(null); // Store chart instance

    useEffect(() => {
        const getBudget = async () => {
            try {
                const res = await axios.get('http://localhost:3001/budget');
                const budgetData = res.data.myBudget;

                const newData = {
                    datasets: [
                        {
                            data: budgetData.map(item => item.budget),
                            backgroundColor: [
                                "#FF5733",  
                                "#33FF57",  
                                "#3357FF",  
                                "#FF33A6",  
                                "#FFD700",  
                                "#800080",  
                                "#00CED1"  
                            ]
                        }
                    ],
                    labels: budgetData.map(item => item.title)
                };

                setChartData(newData); // Update the chart data
            } catch (error) {
                console.error('Error fetching budget data:', error);
            }
        };

        getBudget();
    }, []); 

    useEffect(() => {
        if (canvasRef.current) {
            // Destroy the previous chart instance if it exists
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            // Create new chart instance
            const ctx = canvasRef.current.getContext('2d');
            chartInstanceRef.current = new Chart(ctx, {
                type: 'pie',
                data: chartData
            });
        }
    }, [chartData]);

    const svgd3Ref = useRef(null); // Reference to the SVG element


      // D3 chart rendering using chartData
  useEffect(() => {
    if (!chartData) return; // Wait for chartData to be populated

    const svg = d3.select(svgd3Ref.current);
    svg.selectAll('*').remove(); // Clear previous chart (if any)

    const width = 960;
    const height = 450;
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie()
      .sort(null)
      .value((d, i) => chartData.datasets[0].data[i]);

    const arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const color = d3.scaleOrdinal()
      .domain(chartData.labels)
      .range(chartData.datasets[0].backgroundColor);

    const g = svg.append("g")
      .attr("transform", `translate(${width / 3 + 20}, ${height / 2})`);

    // Create pie slices
    const slices = g.selectAll(".slice")
      .data(pie(chartData.labels.map((label, i) => ({ label, value: chartData.datasets[0].data[i] }))))
      .enter()
      .append("g")
      .attr("class", "slice");

    slices.append("path")
      .attr("d", arc)
      .style("fill", d => color(d.data.label));

    // Add text labels
    const text = g.selectAll("text")
      .data(pie(chartData.labels.map((label, i) => ({ label, value: chartData.datasets[0].data[i] }))))
      .enter()
      .append("text")
      .attr("dy", ".35em")
      .text(d => d.data.label)
      .attr("transform", function(d) {
        const pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", d => (midAngle(d) < Math.PI ? "start" : "end"));

    const polyline = g.selectAll("polyline")
      .data(pie(chartData.labels.map((label, i) => ({ label, value: chartData.datasets[0].data[i] }))))
      .enter()
      .append("polyline")
      .attr("points", function(d) {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style("fill", "none")
      .style("stroke", "black");

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

  }, [chartData]);


  return (
<main className="center" id="main">

<div className="page-area">

    <article>
        <h1>Stay on track</h1>
        <p>
            Do you know where you are spending your money? If you really stop to track it down,
            you would get surprised! Proper budget management depends on real data... and this
            app will help you with that!
        </p>
    </article>

    <article>
        <h1>Alerts</h1>
        <p>
            What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
        </p>
    </article>

    <article>
        <h1>Results</h1>
        <p>
            People who stick to a financial plan, budgeting every expense, get out of debt faster!
            Also, they live happier lives... since they spend without guilt or fear... 
            because they know it is all good and accounted for.
        </p>
    </article>

    <article>
        <h1>Free</h1>
        <p>
            This app is free!!! And you are the only one holding your data!
        </p>
    </article>
    <figure>
        <h1 id="chart">Chart</h1>
        <p>
            <canvas ref={canvasRef} width="400" height="400"></canvas>
        </p>
    </figure>
    <div>
        <h1>D3.js</h1>
        <svg ref={svgd3Ref} width="460px" height="450px" style={{margin: '5px'}}></svg>
    </div>


</div>

</main>
  );
}

export default Homepage;