import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function CheatSheet() {
  return (
    <div className="grid gap-6">
      <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-2xl font-semibold text-primary mb-4">Statistical Hypotheses</h2>
        <div className="space-y-4 text-foreground">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Hypothesis?</h3>
            <p className="leading-relaxed">
              A statistical hypothesis is an assumption or claim about a population parameter (like mean, variance, or proportion). 
              We use sample data to test whether this claim is likely to be true.
            </p>
          </div>
          
          <Separator />
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <Badge className="mb-2 bg-primary">H₀</Badge>
              <h4 className="font-semibold mb-2">Null Hypothesis</h4>
              <p className="text-sm leading-relaxed">
                The default assumption stating no effect or no difference. We assume H₀ is true until evidence suggests otherwise.
              </p>
              <p className="text-sm font-mono mt-2 text-muted-foreground">
                Example: H₀: μ = 100
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <Badge className="mb-2 bg-accent">H₁ or Hₐ</Badge>
              <h4 className="font-semibold mb-2">Alternative Hypothesis</h4>
              <p className="text-sm leading-relaxed">
                The claim we're testing for - suggests there is an effect or difference. What we want to prove.
              </p>
              <p className="text-sm font-mono mt-2 text-muted-foreground">
                Example: H₁: μ ≠ 100
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-2xl font-semibold text-primary mb-4">Type I and Type II Errors</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="p-3 text-left font-semibold">Decision</th>
                <th className="p-3 text-center font-semibold bg-muted/30">H₀ is True</th>
                <th className="p-3 text-center font-semibold bg-muted/30">H₀ is False</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold bg-muted/30">Reject H₀</td>
                <td className="p-3 text-center">
                  <Badge variant="destructive" className="mb-1">Type I Error (α)</Badge>
                  <p className="text-xs mt-1">False Positive</p>
                </td>
                <td className="p-3 text-center">
                  <Badge className="mb-1 bg-green-600">Correct Decision</Badge>
                  <p className="text-xs mt-1">Power (1-β)</p>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold bg-muted/30">Fail to Reject H₀</td>
                <td className="p-3 text-center">
                  <Badge className="mb-1 bg-green-600">Correct Decision</Badge>
                  <p className="text-xs mt-1">Confidence (1-α)</p>
                </td>
                <td className="p-3 text-center">
                  <Badge variant="destructive" className="mb-1">Type II Error (β)</Badge>
                  <p className="text-xs mt-1">False Negative</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-destructive">Type I Error (α)</h4>
            <p className="text-sm leading-relaxed mb-2">
              Rejecting H₀ when it's actually true. Also called <strong>significance level</strong>.
            </p>
            <p className="text-xs text-muted-foreground">
              Common values: α = 0.05, 0.01, or 0.10
            </p>
          </div>
          
          <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-destructive">Type II Error (β)</h4>
            <p className="text-sm leading-relaxed mb-2">
              Failing to reject H₀ when it's actually false. Missing a real effect.
            </p>
            <p className="text-xs text-muted-foreground">
              Power = 1 - β (probability of correctly rejecting false H₀)
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-2xl font-semibold text-primary mb-4">One-Sided vs Two-Sided Tests</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Badge className="bg-accent">Two-Tailed</Badge>
              Two-Sided Test
            </h3>
            <div className="space-y-3">
              <div className="bg-muted/50 p-3 rounded">
                <p className="font-mono text-sm mb-1">H₀: μ = μ₀</p>
                <p className="font-mono text-sm">H₁: μ ≠ μ₀</p>
              </div>
              <p className="text-sm leading-relaxed">
                Tests for difference in <strong>either direction</strong>. The parameter could be greater than or less than the hypothesized value.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Use when:</strong> You want to detect any difference, regardless of direction.
              </p>
              <p className="text-sm text-muted-foreground">
                Critical regions are in <strong>both tails</strong> of the distribution (α/2 in each tail).
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Badge className="bg-primary">One-Tailed</Badge>
              One-Sided Test
            </h3>
            <div className="space-y-3">
              <div className="bg-muted/50 p-3 rounded">
                <p className="font-semibold text-xs mb-2">Right-tailed:</p>
                <p className="font-mono text-sm mb-1">H₀: μ {'≤'} μ₀</p>
                <p className="font-mono text-sm mb-3">H₁: μ {'>'} μ₀</p>
                
                <p className="font-semibold text-xs mb-2">Left-tailed:</p>
                <p className="font-mono text-sm mb-1">H₀: μ {'≥'} μ₀</p>
                <p className="font-mono text-sm">H₁: μ {'<'} μ₀</p>
              </div>
              <p className="text-sm leading-relaxed">
                Tests for difference in <strong>one specific direction</strong> only.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Use when:</strong> You have a directional prediction based on theory.
              </p>
              <p className="text-sm text-muted-foreground">
                Critical region is in <strong>one tail</strong> (all α in that tail).
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="single-sample" className="border rounded-lg px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="text-xl font-semibold text-primary hover:no-underline py-4">
            Tests on a Single Sample
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <p className="leading-relaxed">
                Used when comparing a sample to a known population value or testing a claim about a single population parameter.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">One-Sample T-Test</h4>
                <p className="text-sm mb-3">Tests whether a sample mean differs from a hypothesized population mean.</p>
                
                <div className="bg-background p-3 rounded border border-border">
                  <p className="font-mono text-sm mb-2">t = (x̄ - μ₀) / (s / √n)</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>x̄ = sample mean</p>
                    <p>μ₀ = hypothesized population mean</p>
                    <p>s = sample standard deviation</p>
                    <p>n = sample size</p>
                    <p>df = n - 1</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">One-Sample Z-Test</h4>
                <p className="text-sm mb-3">Used when population standard deviation (σ) is known and n ≥ 30.</p>
                
                <div className="bg-background p-3 rounded border border-border">
                  <p className="font-mono text-sm">z = (x̄ - μ₀) / (σ / √n)</p>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>When to use:</strong> Testing if the average height of students is 170cm, or if a new teaching method produces test scores different from the historical average of 75.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="two-sample" className="border rounded-lg px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="text-xl font-semibold text-primary hover:no-underline py-4">
            Tests on Two Samples
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <p className="leading-relaxed">
                Used when comparing two independent groups or testing if there's a difference between two population parameters.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Independent Two-Sample T-Test</h4>
                <p className="text-sm mb-3">Compares means from two independent groups (e.g., treatment vs control).</p>
                
                <div className="bg-background p-3 rounded border border-border mb-3">
                  <p className="font-semibold text-xs mb-2">Equal Variances:</p>
                  <p className="font-mono text-sm mb-2">t = (x̄₁ - x̄₂) / (s_p × √(1/n₁ + 1/n₂))</p>
                  <p className="font-mono text-xs text-muted-foreground">s_p = √[((n₁-1)s₁² + (n₂-1)s₂²) / (n₁+n₂-2)]</p>
                  <p className="text-xs text-muted-foreground mt-2">df = n₁ + n₂ - 2</p>
                </div>

                <div className="bg-background p-3 rounded border border-border">
                  <p className="font-semibold text-xs mb-2">Unequal Variances (Welch's t-test):</p>
                  <p className="font-mono text-sm">t = (x̄₁ - x̄₂) / √(s₁²/n₁ + s₂²/n₂)</p>
                  <p className="text-xs text-muted-foreground mt-2">df ≈ complex formula (Welch-Satterthwaite)</p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Paired T-Test</h4>
                <p className="text-sm mb-3">Compares means from the same group at different times (before/after) or matched pairs.</p>
                
                <div className="bg-background p-3 rounded border border-border">
                  <p className="font-mono text-sm mb-2">t = d̄ / (s_d / √n)</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>d̄ = mean of differences</p>
                    <p>s_d = standard deviation of differences</p>
                    <p>n = number of pairs</p>
                    <p>df = n - 1</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>When to use:</strong> Comparing exam scores between two teaching methods (independent), or comparing blood pressure before and after medication (paired).
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="goodness-of-fit" className="border rounded-lg px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="text-xl font-semibold text-primary hover:no-underline py-4">
            Goodness of Fit Test
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <p className="leading-relaxed">
                Tests whether observed data follows an expected distribution. Uses the Chi-Square (χ²) test.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Chi-Square Goodness of Fit</h4>
                <p className="text-sm mb-3">Determines if observed frequencies match expected frequencies.</p>
                
                <div className="bg-background p-3 rounded border border-border">
                  <p className="font-mono text-sm mb-3">χ² = Σ [(O_i - E_i)² / E_i]</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>O_i = observed frequency in category i</p>
                    <p>E_i = expected frequency in category i</p>
                    <p>df = k - 1 (k = number of categories)</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Decision Rule</h4>
                <div className="space-y-2 text-sm">
                  <p>• If χ² {'>'} χ²_critical: Reject H₀ (data doesn't fit expected distribution)</p>
                  <p>• If χ² {'≤'} χ²_critical: Fail to reject H₀ (data fits expected distribution)</p>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>When to use:</strong> Testing if a die is fair (equal probability for each face), or if survey responses match expected demographic distributions.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hypothesis-testing-steps" className="border rounded-lg px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="text-xl font-semibold text-primary hover:no-underline py-4">
            Steps in Hypothesis Testing
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3">
              {[
                { step: 1, title: "State the Hypotheses", desc: "Define H₀ (null) and H₁ (alternative) clearly" },
                { step: 2, title: "Choose Significance Level", desc: "Select α (typically 0.05, 0.01, or 0.10)" },
                { step: 3, title: "Select Test Statistic", desc: "Choose appropriate test (t-test, z-test, χ², etc.)" },
                { step: 4, title: "Determine Critical Region", desc: "Find critical value(s) based on α and test type" },
                { step: 5, title: "Calculate Test Statistic", desc: "Compute the value from your sample data" },
                { step: 6, title: "Make Decision", desc: "Compare test statistic to critical value or use p-value" },
                { step: 7, title: "State Conclusion", desc: "Interpret results in context of original problem" }
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4 items-start bg-muted/30 p-3 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    {step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="p-6 shadow-sm hover:shadow-md transition-shadow bg-accent/5 border-accent/30">
        <h2 className="text-2xl font-semibold text-primary mb-4">Quick Reference: P-Value Interpretation</h2>
        <div className="space-y-3">
          <p className="leading-relaxed">
            The <strong>p-value</strong> is the probability of obtaining results as extreme as observed, assuming H₀ is true.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <p className="font-semibold text-green-800 mb-1">p &gt; α</p>
              <p className="text-sm text-green-700">Fail to reject H₀</p>
              <p className="text-xs text-green-600 mt-1">Not enough evidence</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="font-semibold text-yellow-800 mb-1">p ≈ α</p>
              <p className="text-sm text-yellow-700">Borderline case</p>
              <p className="text-xs text-yellow-600 mt-1">Consider context</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="font-semibold text-red-800 mb-1">p &lt; α</p>
              <p className="text-sm text-red-700">Reject H₀</p>
              <p className="text-xs text-red-600 mt-1">Significant result</p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg mt-4">
            <p className="text-sm font-semibold mb-2">Common p-value interpretations:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• p &lt; 0.001: Very strong evidence against H₀</li>
              <li>• p &lt; 0.01: Strong evidence against H₀</li>
              <li>• p &lt; 0.05: Moderate evidence against H₀</li>
              <li>• p &gt; 0.05: Insufficient evidence against H₀</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}