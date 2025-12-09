import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Warning, ListNumbers, Function, DownloadSimple, ShareNetwork } from "@phosphor-icons/react"
import { toast } from "sonner"
import TDistributionChart from "./TDistributionChart"
import { calculateTTest, calculateTTestFromStats, TTestResult, TTestType } from "@/lib/statistics"

type InputMode = "raw" | "summary"

export default function TTestCalculator() {
  const [inputMode, setInputMode] = useState<InputMode>("raw")
  const [testType, setTestType] = useState<TTestType>("one-sample")
  
  const [sampleData, setSampleData] = useState("")
  const [sample2Data, setSample2Data] = useState("")
  
  const [mean1, setMean1] = useState("")
  const [sd1, setSd1] = useState("")
  const [n1, setN1] = useState("")
  const [mean2, setMean2] = useState("")
  const [sd2, setSd2] = useState("")
  const [n2, setN2] = useState("")
  
  const [hypothesizedMean, setHypothesizedMean] = useState("0")
  const [alpha, setAlpha] = useState("0.05")
  const [tailType, setTailType] = useState<"two" | "left" | "right">("two")
  const [result, setResult] = useState<TTestResult | null>(null)
  const [error, setError] = useState("")
  const [showReportDialog, setShowReportDialog] = useState(false)

  const handleCalculate = () => {
    setError("")
    
    try {
      if (inputMode === "raw") {
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
      } else {
        const sampleMean1 = parseFloat(mean1)
        const sampleSD1 = parseFloat(sd1)
        const sampleN1 = parseInt(n1)
        const mu0 = parseFloat(hypothesizedMean)
        const alphaValue = parseFloat(alpha)

        if (isNaN(sampleMean1) || isNaN(sampleSD1) || isNaN(sampleN1)) {
          setError("Invalid sample statistics for Sample 1")
          return
        }

        if (sampleN1 < 2) {
          setError("Sample size must be at least 2")
          return
        }

        if (sampleSD1 <= 0) {
          setError("Standard deviation must be positive")
          return
        }

        if (testType === "two-sample" || testType === "paired") {
          const sampleMean2 = parseFloat(mean2)
          const sampleSD2 = parseFloat(sd2)
          const sampleN2 = parseInt(n2)

          if (isNaN(sampleMean2) || isNaN(sampleSD2) || isNaN(sampleN2)) {
            setError("Invalid sample statistics for Sample 2")
            return
          }

          if (sampleN2 < 2) {
            setError("Sample 2 size must be at least 2")
            return
          }

          if (sampleSD2 <= 0) {
            setError("Sample 2 standard deviation must be positive")
            return
          }

          if (testType === "paired" && sampleN1 !== sampleN2) {
            setError("Paired samples must have the same sample size")
            return
          }

          const testResult = calculateTTestFromStats(
            sampleMean1, sampleSD1, sampleN1,
            testType, tailType, alphaValue,
            mu0,
            sampleMean2, sampleSD2, sampleN2
          )
          setResult(testResult)
        } else {
          if (isNaN(mu0) || isNaN(alphaValue)) {
            setError("Invalid hypothesized mean or alpha value")
            return
          }

          if (alphaValue <= 0 || alphaValue >= 1) {
            setError("Alpha must be between 0 and 1")
            return
          }

          const testResult = calculateTTestFromStats(
            sampleMean1, sampleSD1, sampleN1,
            testType, tailType, alphaValue,
            mu0
          )
          setResult(testResult)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during calculation")
    }
  }

  const handleClear = () => {
    setSampleData("")
    setSample2Data("")
    setMean1("")
    setSd1("")
    setN1("")
    setMean2("")
    setSd2("")
    setN2("")
    setHypothesizedMean("0")
    setResult(null)
    setError("")
  }

  const exportToCSV = () => {
    if (!result) return

    const rows = [
      ["T-Test Results Report"],
      [""],
      ["Test Configuration"],
      ["Test Type", testType],
      ["Tail Type", tailType],
      ["Significance Level (α)", alpha],
      ...(testType === "one-sample" ? [["Hypothesized Mean (μ₀)", hypothesizedMean]] : []),
      [""],
      ["Hypotheses"],
      ["Null Hypothesis (H₀)", result.hypotheses.null],
      ["Alternative Hypothesis (H₁)", result.hypotheses.alternative],
      [""],
      ["Sample Statistics"],
      ["Sample Mean", result.sampleMean.toFixed(4)],
      ["Sample SD", result.sampleSD.toFixed(4)],
      ["Sample Size", result.sampleSize.toString()],
      ["Degrees of Freedom", result.df.toString()],
      [""],
      ["Test Results"],
      ["T-Statistic", result.tStatistic.toFixed(4)],
      ["P-Value", result.pValue.toFixed(4)],
      ["Critical Value(s)", result.criticalValue.map(v => v.toFixed(4)).join(", ")],
      ["Decision", result.reject ? "Reject H₀" : "Fail to Reject H₀"],
      [""],
      ["Conclusion"],
      [result.conclusion],
      [""],
      ["Interpretation"],
      [result.interpretation]
    ]

    const csvContent = rows.map(row => 
      row.map(cell => {
        const cellStr = String(cell)
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`
        }
        return cellStr
      }).join(',')
    ).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `t-test-results-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Results exported to CSV")
  }

  const generateFormattedReport = () => {
    if (!result) return ""

    const testTypeNames = {
      "one-sample": "One-Sample T-Test",
      "two-sample": "Two-Sample T-Test",
      "paired": "Paired T-Test"
    }

    const tailTypeNames = {
      "two": "Two-Tailed",
      "left": "Left-Tailed",
      "right": "Right-Tailed"
    }

    return `═══════════════════════════════════════════════════════
T-TEST ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}
═══════════════════════════════════════════════════════

TEST CONFIGURATION
─────────────────────────────────────────────────────
Test Type:          ${testTypeNames[testType]}
Tail Type:          ${tailTypeNames[tailType]}
Significance (α):   ${alpha}${testType === "one-sample" ? `
Hypothesized Mean:  ${hypothesizedMean}` : ""}

HYPOTHESES
─────────────────────────────────────────────────────
H₀ (Null):         ${result.hypotheses.null}
H₁ (Alternative):  ${result.hypotheses.alternative}

SAMPLE STATISTICS
─────────────────────────────────────────────────────
Mean:               ${result.sampleMean.toFixed(4)}
Standard Deviation: ${result.sampleSD.toFixed(4)}
Sample Size:        ${result.sampleSize}
Degrees of Freedom: ${result.df}

TEST RESULTS
─────────────────────────────────────────────────────
T-Statistic:        ${result.tStatistic.toFixed(4)}
P-Value:            ${result.pValue.toFixed(4)}
Critical Value(s):  ${result.criticalValue.map(v => v.toFixed(4)).join(", ")}

DECISION
─────────────────────────────────────────────────────
${result.reject ? "✗ REJECT H₀" : "✓ FAIL TO REJECT H₀"}
${result.pValue < parseFloat(alpha) 
  ? `p-value (${result.pValue.toFixed(4)}) < α (${alpha})`
  : `p-value (${result.pValue.toFixed(4)}) ≥ α (${alpha})`}

CONCLUSION
─────────────────────────────────────────────────────
${result.conclusion}

INTERPRETATION
─────────────────────────────────────────────────────
${result.interpretation}

═══════════════════════════════════════════════════════`
  }

  const copyReportToClipboard = async () => {
    const report = generateFormattedReport()
    try {
      await navigator.clipboard.writeText(report)
      toast.success("Report copied to clipboard")
    } catch (err) {
      toast.error("Failed to copy report")
    }
  }

  const downloadReportAsText = () => {
    const report = generateFormattedReport()
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `t-test-report-${new Date().toISOString().split('T')[0]}.txt`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Report downloaded")
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-primary">Data Input</h2>
          </div>
          
          <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as InputMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="raw" className="gap-2">
                <ListNumbers size={18} weight="duotone" />
                Raw Data
              </TabsTrigger>
              <TabsTrigger value="summary" className="gap-2">
                <Function size={18} weight="duotone" />
                Summary Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="raw" className="space-y-4 mt-0">
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
            </TabsContent>

            <TabsContent value="summary" className="space-y-4 mt-0">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">
                  {testType === "two-sample" ? "Sample 1 Statistics" : testType === "paired" ? "Difference Statistics (d = Before - After)" : "Sample Statistics"}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="mean1" className="text-xs mb-1 block">
                      Mean {testType === "paired" && "(d̄)"}
                    </Label>
                    <Input
                      id="mean1"
                      type="number"
                      step="any"
                      value={mean1}
                      onChange={(e) => setMean1(e.target.value)}
                      placeholder="x̄"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sd1" className="text-xs mb-1 block">
                      Std Dev {testType === "paired" && "(sᵈ)"}
                    </Label>
                    <Input
                      id="sd1"
                      type="number"
                      step="any"
                      value={sd1}
                      onChange={(e) => setSd1(e.target.value)}
                      placeholder="s"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="n1" className="text-xs mb-1 block">
                      Size (n)
                    </Label>
                    <Input
                      id="n1"
                      type="number"
                      step="1"
                      value={n1}
                      onChange={(e) => setN1(e.target.value)}
                      placeholder="n"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {testType === "two-sample" && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Sample 2 Statistics</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="mean2" className="text-xs mb-1 block">
                        Mean
                      </Label>
                      <Input
                        id="mean2"
                        type="number"
                        step="any"
                        value={mean2}
                        onChange={(e) => setMean2(e.target.value)}
                        placeholder="x̄₂"
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sd2" className="text-xs mb-1 block">
                        Std Dev
                      </Label>
                      <Input
                        id="sd2"
                        type="number"
                        step="any"
                        value={sd2}
                        onChange={(e) => setSd2(e.target.value)}
                        placeholder="s₂"
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="n2" className="text-xs mb-1 block">
                        Size (n)
                      </Label>
                      <Input
                        id="n2"
                        type="number"
                        step="1"
                        value={n2}
                        onChange={(e) => setN2(e.target.value)}
                        placeholder="n₂"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {testType === "paired" && (
                <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg">
                  <p className="text-xs leading-relaxed">
                    <strong>Note:</strong> For paired t-test with summary stats, enter the statistics of the <strong>differences</strong> (d = Before - After), not the individual group statistics.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 p-3 rounded-lg flex items-start gap-2 mt-4">
              <Warning size={20} className="text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCalculate} className="flex-1" size="lg">
              Calculate
            </Button>
            <Button onClick={handleClear} variant="outline" size="lg">
              Clear
            </Button>
          </div>
        </Card>

        {result && (
          <Card className="p-6 shadow-sm bg-muted/30">
            <h3 className="text-lg font-semibold mb-3">Sample Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-background p-3 rounded">
                <p className="text-muted-foreground text-xs mb-1">
                  {testType === "paired" ? "Mean Difference" : testType === "two-sample" ? "Mean Difference" : "Sample Mean"}
                </p>
                <p className="font-mono font-semibold">{result.sampleMean.toFixed(4)}</p>
              </div>
              <div className="bg-background p-3 rounded">
                <p className="text-muted-foreground text-xs mb-1">
                  {testType === "two-sample" ? "Pooled SD" : "Sample SD"}
                </p>
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
              
              <div className="flex gap-2 mb-4">
                <Button onClick={exportToCSV} variant="outline" size="sm" className="gap-2">
                  <DownloadSimple size={18} weight="duotone" />
                  Export CSV
                </Button>
                <Button onClick={() => setShowReportDialog(true)} variant="outline" size="sm" className="gap-2">
                  <ShareNetwork size={18} weight="duotone" />
                  Share Report
                </Button>
              </div>
              
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

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Formatted Report</DialogTitle>
            <DialogDescription>
              Copy or download this formatted analysis report
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <pre className="bg-muted/50 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-border whitespace-pre-wrap break-words">
              {result && generateFormattedReport()}
            </pre>
            
            <div className="flex gap-2">
              <Button onClick={copyReportToClipboard} className="flex-1 gap-2">
                <ShareNetwork size={18} weight="duotone" />
                Copy to Clipboard
              </Button>
              <Button onClick={downloadReportAsText} variant="outline" className="flex-1 gap-2">
                <DownloadSimple size={18} weight="duotone" />
                Download as TXT
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}