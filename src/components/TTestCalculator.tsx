import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Warning } from "@phosphor-icons/react"
import TDistributionChart from "./TDistributionChart"
import { calculateTTest, TTestResult, TTestType } from "@/lib/statistics"

export default function TTestCalculator() {
  const [testType, setTestType] = useState<TTestType>("one-sample")
  const [sampleData, setSampleData] = useState("")
  const [sample2Data, setSample2Data] = useState("")
  const [hypothesizedMean, setHypothesizedMean] = useState("0")
  const [alpha, setAlpha] = useState("0.05")
  const [tailType, setTailType] = useState<"two" | "left" | "right">("two")
  const [result, setResult] = useState<TTestResult | null>(null)
  const [error, setError] = useState("")

  const handleCalculate = () => {
    setError("")
    
    try {
      const sample1 = sampleData.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
      
      if (sample1.length < 2) {
        setError("Sample 1 must have at least 2 values")
        return
      }

      let sample2: number[] | undefined
      if (testType === "two-sample" || testType === "paired") {
        sample2 = sample2Data.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
        
        if (sample2.length < 2) {
          setError("Sample 2 must have at least 2 values")
          return
        }

        if (testType === "paired" && sample1.length !== sample2.length) {
          setError("Paired samples must have the same number of values")
          return
        }
      }

      const mu0 = parseFloat(hypothesizedMean)
      const alphaValue = parseFloat(alpha)

      if (isNaN(mu0) || isNaN(alphaValue)) {
        setError("Invalid hypothesized mean or alpha value")
        return
      }

      if (alphaValue <= 0 || alphaValue >= 1) {
        setError("Alpha must be between 0 and 1")
        return
      }

      const testResult = calculateTTest(sample1, testType, tailType, alphaValue, mu0, sample2)
      setResult(testResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during calculation")
    }
  }

  const handleClear = () => {
    setSampleData("")
    setSample2Data("")
    setHypothesizedMean("0")
    setResult(null)
    setError("")
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-primary mb-4">Test Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-type" className="text-sm font-medium mb-2 block">
                Test Type
              </Label>
              <Select value={testType} onValueChange={(value) => setTestType(value as TTestType)}>
                <SelectTrigger id="test-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-sample">One-Sample T-Test</SelectItem>
                  <SelectItem value="two-sample">Two-Sample T-Test</SelectItem>
                  <SelectItem value="paired">Paired T-Test</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {testType === "one-sample" && "Compare sample mean to a hypothesized value"}
                {testType === "two-sample" && "Compare means of two independent groups"}
                {testType === "paired" && "Compare means of paired/matched observations"}
              </p>
            </div>

            <div>
              <Label htmlFor="tail-type" className="text-sm font-medium mb-2 block">
                Tail Type
              </Label>
              <Select value={tailType} onValueChange={(value) => setTailType(value as "two" | "left" | "right")}>
                <SelectTrigger id="tail-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="two">Two-Tailed (≠)</SelectItem>
                  <SelectItem value="right">Right-Tailed ({'>'})</SelectItem>
                  <SelectItem value="left">Left-Tailed ({'<'})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="alpha" className="text-sm font-medium mb-2 block">
                Significance Level (α)
              </Label>
              <Select value={alpha} onValueChange={setAlpha}>
                <SelectTrigger id="alpha">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.10">0.10 (10%)</SelectItem>
                  <SelectItem value="0.05">0.05 (5%)</SelectItem>
                  <SelectItem value="0.01">0.01 (1%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {testType === "one-sample" && (
              <div>
                <Label htmlFor="hypothesized-mean" className="text-sm font-medium mb-2 block">
                  Hypothesized Mean (μ₀)
                </Label>
                <Input
                  id="hypothesized-mean"
                  type="number"
                  step="any"
                  value={hypothesizedMean}
                  onChange={(e) => setHypothesizedMean(e.target.value)}
                  placeholder="e.g., 100"
                />
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-primary mb-4">Sample Data</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="sample-data" className="text-sm font-medium mb-2 block">
                {testType === "two-sample" ? "Sample 1 Data" : testType === "paired" ? "Before / Group 1" : "Sample Data"}
              </Label>
              <Input
                id="sample-data"
                value={sampleData}
                onChange={(e) => setSampleData(e.target.value)}
                placeholder="Enter values separated by commas (e.g., 23, 25, 27, 29, 31)"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated numbers
              </p>
            </div>

            {(testType === "two-sample" || testType === "paired") && (
              <div>
                <Label htmlFor="sample2-data" className="text-sm font-medium mb-2 block">
                  {testType === "paired" ? "After / Group 2" : "Sample 2 Data"}
                </Label>
                <Input
                  id="sample2-data"
                  value={sample2Data}
                  onChange={(e) => setSample2Data(e.target.value)}
                  placeholder="Enter values separated by commas"
                  className="font-mono text-sm"
                />
                {testType === "paired" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Must have same number of values as Sample 1
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 p-3 rounded-lg flex items-start gap-2">
                <Warning size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button onClick={handleCalculate} className="flex-1" size="lg">
                Calculate
              </Button>
              <Button onClick={handleClear} variant="outline" size="lg">
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {result && (
          <Card className="p-6 shadow-sm bg-muted/30">
            <h3 className="text-lg font-semibold mb-3">Sample Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-background p-3 rounded">
                <p className="text-muted-foreground text-xs mb-1">Sample Mean</p>
                <p className="font-mono font-semibold">{result.sampleMean.toFixed(4)}</p>
              </div>
              <div className="bg-background p-3 rounded">
                <p className="text-muted-foreground text-xs mb-1">Sample SD</p>
                <p className="font-mono font-semibold">{result.sampleSD.toFixed(4)}</p>
              </div>
              <div className="bg-background p-3 rounded">
                <p className="text-muted-foreground text-xs mb-1">Sample Size</p>
                <p className="font-mono font-semibold">{result.sampleSize}</p>
              </div>
              <div className="bg-background p-3 rounded">
                <p className="text-muted-foreground text-xs mb-1">Degrees of Freedom</p>
                <p className="font-mono font-semibold">{result.df}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        {result && (
          <>
            <Card className="p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-primary mb-4">Test Results</h2>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm">Hypotheses</h3>
                  <p className="font-mono text-sm mb-1">H₀: {result.hypotheses.null}</p>
                  <p className="font-mono text-sm">H₁: {result.hypotheses.alternative}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">T-Statistic</p>
                    <p className="text-2xl font-bold font-mono">{result.tStatistic.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">P-Value</p>
                    <p className="text-2xl font-bold font-mono">{result.pValue.toFixed(4)}</p>
                  </div>
                </div>

                <div className="bg-background border-2 border-border p-4 rounded-lg">
                  <p className="text-muted-foreground text-sm mb-1">Critical Value(s)</p>
                  <p className="font-mono text-lg font-semibold">
                    {result.criticalValue.map(v => v.toFixed(4)).join(", ")}
                  </p>
                </div>

                <Separator />

                <div className={`p-4 rounded-lg border-2 ${
                  result.reject 
                    ? "bg-accent/10 border-accent" 
                    : "bg-green-50 border-green-200"
                }`}>
                  <div className="flex items-start gap-3">
                    {result.reject ? (
                      <XCircle size={28} weight="fill" className="text-accent flex-shrink-0" />
                    ) : (
                      <CheckCircle size={28} weight="fill" className="text-green-600 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        Decision
                        <Badge variant={result.reject ? "destructive" : "default"} className={!result.reject ? "bg-green-600" : ""}>
                          {result.reject ? "Reject H₀" : "Fail to Reject H₀"}
                        </Badge>
                      </h3>
                      <p className="text-sm leading-relaxed">
                        {result.conclusion}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {result.pValue < parseFloat(alpha) 
                          ? `p-value (${result.pValue.toFixed(4)}) < α (${alpha})`
                          : `p-value (${result.pValue.toFixed(4)}) ≥ α (${alpha})`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Interpretation</h4>
                  <p className="text-sm leading-relaxed">
                    {result.interpretation}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-primary mb-4">Distribution Visualization</h2>
              <TDistributionChart 
                tStatistic={result.tStatistic}
                criticalValues={result.criticalValue}
                df={result.df}
                tailType={tailType}
                alpha={parseFloat(alpha)}
              />
            </Card>
          </>
        )}

        {!result && (
          <Card className="p-12 shadow-sm bg-muted/20 border-dashed">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">No Results Yet</p>
              <p className="text-sm">
                Enter your sample data and click Calculate to see test results and visualization
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}