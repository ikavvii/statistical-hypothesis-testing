import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { TailType } from "@/lib/statistics"

interface TDistributionChartProps {
  tStatistic: number
  criticalValues: number[]
  df: number
  tailType: TailType
  alpha: number
}

function tPDF(x: number, df: number): number {
  const numerator = Math.pow(1 + (x * x) / df, -(df + 1) / 2)
  const denominator = Math.sqrt(df) * beta(df / 2, 0.5)
  return numerator / denominator
}

function beta(a: number, b: number): number {
  return Math.exp(gammaLn(a) + gammaLn(b) - gammaLn(a + b))
}

function gammaLn(x: number): number {
  const cof = [
    76.18009172947146, -86.50532032941677,
    24.01409824083091, -1.231739572450155,
    0.1208650973866179e-2, -0.5395239384953e-5
  ]
  
  let y = x
  let tmp = x + 5.5
  tmp -= (x + 0.5) * Math.log(tmp)
  let ser = 1.000000000190015
  
  for (let j = 0; j < 6; j++) {
    ser += cof[j] / ++y
  }
  
  return -tmp + Math.log(2.5066282746310005 * ser / x)
}

export default function TDistributionChart({
  tStatistic,
  criticalValues,
  df,
  tailType,
  alpha
}: TDistributionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 600
    const height = 350
    const margin = { top: 20, right: 20, bottom: 50, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const range = Math.max(4, Math.abs(tStatistic) + 1, ...criticalValues.map(Math.abs).map(v => v + 1))
    const xMin = -range
    const xMax = range

    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, innerWidth])

    const points = d3.range(xMin, xMax, (xMax - xMin) / 200)
    const yValues = points.map(x => tPDF(x, df))
    const yMax = Math.max(...yValues) * 1.1

    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0])

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "max-w-full h-auto")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const line = d3.line<number>()
      .x(d => xScale(d))
      .y(d => yScale(tPDF(d, df)))
      .curve(d3.curveBasis)

    const defs = svg.append("defs")
    
    const criticalGradient = defs.append("linearGradient")
      .attr("id", "critical-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")
    
    criticalGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "oklch(0.68 0.19 25)")
      .attr("stop-opacity", 0.4)
    
    criticalGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "oklch(0.68 0.19 25)")
      .attr("stop-opacity", 0.1)

    if (tailType === "two") {
      const leftCritical = criticalValues[0]
      const rightCritical = criticalValues[1]
      
      const leftArea = d3.area<number>()
        .x(d => xScale(d))
        .y0(innerHeight)
        .y1(d => yScale(tPDF(d, df)))
        .curve(d3.curveBasis)
      
      const leftPoints = points.filter(x => x <= leftCritical)
      g.append("path")
        .datum(leftPoints)
        .attr("d", leftArea)
        .attr("fill", "url(#critical-gradient)")
        .attr("opacity", 0.7)
      
      const rightPoints = points.filter(x => x >= rightCritical)
      g.append("path")
        .datum(rightPoints)
        .attr("d", leftArea)
        .attr("fill", "url(#critical-gradient)")
        .attr("opacity", 0.7)
    } else if (tailType === "right") {
      const critical = criticalValues[0]
      const area = d3.area<number>()
        .x(d => xScale(d))
        .y0(innerHeight)
        .y1(d => yScale(tPDF(d, df)))
        .curve(d3.curveBasis)
      
      const rightPoints = points.filter(x => x >= critical)
      g.append("path")
        .datum(rightPoints)
        .attr("d", area)
        .attr("fill", "url(#critical-gradient)")
        .attr("opacity", 0.7)
    } else {
      const critical = criticalValues[0]
      const area = d3.area<number>()
        .x(d => xScale(d))
        .y0(innerHeight)
        .y1(d => yScale(tPDF(d, df)))
        .curve(d3.curveBasis)
      
      const leftPoints = points.filter(x => x <= critical)
      g.append("path")
        .datum(leftPoints)
        .attr("d", area)
        .attr("fill", "url(#critical-gradient)")
        .attr("opacity", 0.7)
    }

    g.append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "oklch(0.45 0.15 250)")
      .attr("stroke-width", 2.5)
      .attr("d", line)

    criticalValues.forEach(cv => {
      g.append("line")
        .attr("x1", xScale(cv))
        .attr("x2", xScale(cv))
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "oklch(0.68 0.19 25)")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
    })

    const tStatX = xScale(tStatistic)
    const tStatY = yScale(tPDF(tStatistic, df))
    
    g.append("line")
      .attr("x1", tStatX)
      .attr("x2", tStatX)
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "oklch(0.25 0.01 250)")
      .attr("stroke-width", 2.5)

    g.append("circle")
      .attr("cx", tStatX)
      .attr("cy", tStatY)
      .attr("r", 5)
      .attr("fill", "oklch(0.25 0.01 250)")
      .attr("stroke", "oklch(0.98 0.005 250)")
      .attr("stroke-width", 2)

    const xAxis = d3.axisBottom(xScale)
      .ticks(8)
      .tickFormat(d => d3.format(".1f")(d as number))
    
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .style("font-family", "IBM Plex Sans")
      .style("font-size", "12px")

    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .style("font-family", "IBM Plex Sans")
      .style("font-size", "14px")
      .style("fill", "oklch(0.55 0.01 250)")
      .text("t-value")

    const legend = g.append("g")
      .attr("transform", `translate(${innerWidth - 180}, 10)`)

    legend.append("rect")
      .attr("width", 180)
      .attr("height", 95)
      .attr("fill", "oklch(1 0 0)")
      .attr("stroke", "oklch(0.88 0.01 250)")
      .attr("rx", 4)

    legend.append("line")
      .attr("x1", 10)
      .attr("x2", 30)
      .attr("y1", 20)
      .attr("y2", 20)
      .attr("stroke", "oklch(0.68 0.19 25)")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")

    legend.append("text")
      .attr("x", 35)
      .attr("y", 24)
      .style("font-family", "IBM Plex Sans")
      .style("font-size", "11px")
      .text(`Critical (α=${alpha})`)

    legend.append("line")
      .attr("x1", 10)
      .attr("x2", 30)
      .attr("y1", 45)
      .attr("y2", 45)
      .attr("stroke", "oklch(0.25 0.01 250)")
      .attr("stroke-width", 2.5)

    legend.append("text")
      .attr("x", 35)
      .attr("y", 49)
      .style("font-family", "IBM Plex Sans")
      .style("font-size", "11px")
      .text(`t = ${tStatistic.toFixed(3)}`)

    legend.append("rect")
      .attr("x", 10)
      .attr("y", 60)
      .attr("width", 20)
      .attr("height", 10)
      .attr("fill", "oklch(0.68 0.19 25)")
      .attr("opacity", 0.4)

    legend.append("text")
      .attr("x", 35)
      .attr("y", 69)
      .style("font-family", "IBM Plex Sans")
      .style("font-size", "11px")
      .text("Rejection region")

  }, [tStatistic, criticalValues, df, tailType, alpha])

  return (
    <div className="bg-background rounded-lg p-4 border border-border">
      <svg ref={svgRef} className="w-full" />
      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>T-distribution with {df} degrees of freedom</p>
      </div>
    </div>
  )
}