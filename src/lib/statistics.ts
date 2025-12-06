export type TTestType = "one-sample" | "two-sample" | "paired"
export type TailType = "two" | "left" | "right"

export interface TTestResult {
  tStatistic: number
  pValue: number
  df: number
  criticalValue: number[]
  sampleMean: number
  sampleSD: number
  sampleSize: number
  hypotheses: {
    null: string
    alternative: string
  }
  reject: boolean
  conclusion: string
  interpretation: string
}

function mean(data: number[]): number {
  return data.reduce((sum, val) => sum + val, 0) / data.length
}

function standardDeviation(data: number[]): number {
  const avg = mean(data)
  const squaredDiffs = data.map(val => Math.pow(val - avg, 2))
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / (data.length - 1)
  return Math.sqrt(variance)
}

function tCDF(t: number, df: number): number {
  const x = df / (df + t * t)
  const a = df / 2
  const b = 0.5
  
  const betaInc = incompleteBeta(x, a, b)
  
  if (t > 0) {
    return 1 - betaInc / 2
  } else {
    return betaInc / 2
  }
}

function incompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  
  const lbeta = gammaLn(a) + gammaLn(b) - gammaLn(a + b)
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a
  
  return front * betaContinuedFraction(x, a, b) / beta(a, b)
}

function beta(a: number, b: number): number {
  return Math.exp(gammaLn(a) + gammaLn(b) - gammaLn(a + b))
}

function betaContinuedFraction(x: number, a: number, b: number): number {
  const maxIterations = 200
  const epsilon = 1e-10
  
  let am = 1
  let bm = 1
  let az = 1
  let qab = a + b
  let qap = a + 1
  let qam = a - 1
  let bz = 1 - qab * x / qap
  
  for (let i = 1; i <= maxIterations; i++) {
    const em = i
    const tem = em + em
    let d = em * (b - em) * x / ((qam + tem) * (a + tem))
    let ap = az + d * am
    let bp = bz + d * bm
    d = -(a + em) * (qab + em) * x / ((a + tem) * (qap + tem))
    const app = ap + d * az
    const bpp = bp + d * bz
    const aold = az
    am = ap / bpp
    bm = bp / bpp
    az = app / bpp
    bz = 1
    
    if (Math.abs(az - aold) < epsilon * Math.abs(az)) {
      return az
    }
  }
  
  return az
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

function tQuantile(p: number, df: number): number {
  if (p <= 0 || p >= 1) {
    throw new Error("Probability must be between 0 and 1")
  }
  
  let t = 0
  let step = 10
  let lastT = 0
  const epsilon = 0.0001
  const maxIterations = 1000
  
  for (let i = 0; i < maxIterations; i++) {
    const cdf = tCDF(t, df)
    const diff = cdf - p
    
    if (Math.abs(diff) < epsilon) {
      return t
    }
    
    if (diff > 0) {
      t -= step
    } else {
      t += step
    }
    
    if (Math.abs(t - lastT) < epsilon) {
      step /= 2
    }
    
    lastT = t
  }
  
  return t
}

export function calculateTTestFromStats(
  mean1: number,
  sd1: number,
  n1: number,
  testType: TTestType,
  tailType: TailType,
  alpha: number,
  hypothesizedMean: number = 0,
  mean2?: number,
  sd2?: number,
  n2?: number
): TTestResult {
  let tStatistic: number
  let df: number
  let sampleMean: number
  let sampleSD: number
  let sampleSize: number
  let hypotheses: { null: string; alternative: string }

  if (testType === "one-sample") {
    sampleMean = mean1
    sampleSD = sd1
    sampleSize = n1
    df = sampleSize - 1
    
    const se = sampleSD / Math.sqrt(sampleSize)
    tStatistic = (sampleMean - hypothesizedMean) / se
    
    hypotheses = {
      null: `μ = ${hypothesizedMean}`,
      alternative: tailType === "two" 
        ? `μ ≠ ${hypothesizedMean}`
        : tailType === "right"
        ? `μ > ${hypothesizedMean}`
        : `μ < ${hypothesizedMean}`
    }
  } else if (testType === "paired") {
    sampleMean = mean1
    sampleSD = sd1
    sampleSize = n1
    df = sampleSize - 1
    
    const se = sampleSD / Math.sqrt(sampleSize)
    tStatistic = sampleMean / se
    
    hypotheses = {
      null: "μd = 0",
      alternative: tailType === "two" 
        ? "μd ≠ 0"
        : tailType === "right"
        ? "μd > 0"
        : "μd < 0"
    }
  } else {
    if (mean2 === undefined || sd2 === undefined || n2 === undefined) {
      throw new Error("Two-sample test requires second sample statistics")
    }
    
    const pooledSD = Math.sqrt(
      ((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (n1 + n2 - 2)
    )
    
    const se = pooledSD * Math.sqrt(1 / n1 + 1 / n2)
    tStatistic = (mean1 - mean2) / se
    
    df = n1 + n2 - 2
    sampleMean = mean1 - mean2
    sampleSD = pooledSD
    sampleSize = n1 + n2
    
    hypotheses = {
      null: "μ₁ = μ₂",
      alternative: tailType === "two" 
        ? "μ₁ ≠ μ₂"
        : tailType === "right"
        ? "μ₁ > μ₂"
        : "μ₁ < μ₂"
    }
  }

  let pValue: number
  let criticalValue: number[]
  
  if (tailType === "two") {
    pValue = 2 * (1 - tCDF(Math.abs(tStatistic), df))
    const tCrit = tQuantile(1 - alpha / 2, df)
    criticalValue = [-tCrit, tCrit]
  } else if (tailType === "right") {
    pValue = 1 - tCDF(tStatistic, df)
    criticalValue = [tQuantile(1 - alpha, df)]
  } else {
    pValue = tCDF(tStatistic, df)
    criticalValue = [tQuantile(alpha, df)]
  }

  const reject = pValue < alpha

  let conclusion: string
  if (reject) {
    conclusion = `There is sufficient evidence at the ${(alpha * 100).toFixed(0)}% significance level to reject the null hypothesis.`
  } else {
    conclusion = `There is insufficient evidence at the ${(alpha * 100).toFixed(0)}% significance level to reject the null hypothesis.`
  }

  let interpretation: string
  if (testType === "one-sample") {
    if (reject) {
      interpretation = `The sample mean (${sampleMean.toFixed(2)}) is significantly different from the hypothesized mean (${hypothesizedMean}).`
    } else {
      interpretation = `The sample mean (${sampleMean.toFixed(2)}) is not significantly different from the hypothesized mean (${hypothesizedMean}).`
    }
  } else if (testType === "paired") {
    if (reject) {
      interpretation = `There is a significant difference between the paired observations (mean difference = ${sampleMean.toFixed(2)}).`
    } else {
      interpretation = `There is no significant difference between the paired observations (mean difference = ${sampleMean.toFixed(2)}).`
    }
  } else {
    if (reject) {
      interpretation = `There is a significant difference between the two groups (mean difference = ${sampleMean.toFixed(2)}).`
    } else {
      interpretation = `There is no significant difference between the two groups (mean difference = ${sampleMean.toFixed(2)}).`
    }
  }

  return {
    tStatistic,
    pValue,
    df,
    criticalValue,
    sampleMean,
    sampleSD,
    sampleSize,
    hypotheses,
    reject,
    conclusion,
    interpretation
  }
}

export function calculateTTest(
  sample1: number[],
  testType: TTestType,
  tailType: TailType,
  alpha: number,
  hypothesizedMean: number = 0,
  sample2?: number[]
): TTestResult {
  let tStatistic: number
  let df: number
  let sampleMean: number
  let sampleSD: number
  let sampleSize: number
  let hypotheses: { null: string; alternative: string }

  if (testType === "one-sample") {
    sampleMean = mean(sample1)
    sampleSD = standardDeviation(sample1)
    sampleSize = sample1.length
    df = sampleSize - 1
    
    const se = sampleSD / Math.sqrt(sampleSize)
    tStatistic = (sampleMean - hypothesizedMean) / se
    
    hypotheses = {
      null: `μ = ${hypothesizedMean}`,
      alternative: tailType === "two" 
        ? `μ ≠ ${hypothesizedMean}`
        : tailType === "right"
        ? `μ > ${hypothesizedMean}`
        : `μ < ${hypothesizedMean}`
    }
  } else if (testType === "paired") {
    if (!sample2 || sample1.length !== sample2.length) {
      throw new Error("Paired samples must have equal length")
    }
    
    const differences = sample1.map((val, i) => val - sample2[i])
    sampleMean = mean(differences)
    sampleSD = standardDeviation(differences)
    sampleSize = differences.length
    df = sampleSize - 1
    
    const se = sampleSD / Math.sqrt(sampleSize)
    tStatistic = sampleMean / se
    
    hypotheses = {
      null: "μd = 0",
      alternative: tailType === "two" 
        ? "μd ≠ 0"
        : tailType === "right"
        ? "μd > 0"
        : "μd < 0"
    }
  } else {
    if (!sample2) {
      throw new Error("Two-sample test requires second sample")
    }
    
    const mean1 = mean(sample1)
    const mean2 = mean(sample2)
    const sd1 = standardDeviation(sample1)
    const sd2 = standardDeviation(sample2)
    const n1 = sample1.length
    const n2 = sample2.length
    
    const pooledSD = Math.sqrt(
      ((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (n1 + n2 - 2)
    )
    
    const se = pooledSD * Math.sqrt(1 / n1 + 1 / n2)
    tStatistic = (mean1 - mean2) / se
    
    df = n1 + n2 - 2
    sampleMean = mean1 - mean2
    sampleSD = pooledSD
    sampleSize = n1 + n2
    
    hypotheses = {
      null: "μ₁ = μ₂",
      alternative: tailType === "two" 
        ? "μ₁ ≠ μ₂"
        : tailType === "right"
        ? "μ₁ > μ₂"
        : "μ₁ < μ₂"
    }
  }

  let pValue: number
  let criticalValue: number[]
  
  if (tailType === "two") {
    pValue = 2 * (1 - tCDF(Math.abs(tStatistic), df))
    const tCrit = tQuantile(1 - alpha / 2, df)
    criticalValue = [-tCrit, tCrit]
  } else if (tailType === "right") {
    pValue = 1 - tCDF(tStatistic, df)
    criticalValue = [tQuantile(1 - alpha, df)]
  } else {
    pValue = tCDF(tStatistic, df)
    criticalValue = [tQuantile(alpha, df)]
  }

  const reject = pValue < alpha

  let conclusion: string
  if (reject) {
    conclusion = `There is sufficient evidence at the ${(alpha * 100).toFixed(0)}% significance level to reject the null hypothesis.`
  } else {
    conclusion = `There is insufficient evidence at the ${(alpha * 100).toFixed(0)}% significance level to reject the null hypothesis.`
  }

  let interpretation: string
  if (testType === "one-sample") {
    if (reject) {
      interpretation = `The sample mean (${sampleMean.toFixed(2)}) is significantly different from the hypothesized mean (${hypothesizedMean}).`
    } else {
      interpretation = `The sample mean (${sampleMean.toFixed(2)}) is not significantly different from the hypothesized mean (${hypothesizedMean}).`
    }
  } else if (testType === "paired") {
    if (reject) {
      interpretation = `There is a significant difference between the paired observations (mean difference = ${sampleMean.toFixed(2)}).`
    } else {
      interpretation = `There is no significant difference between the paired observations (mean difference = ${sampleMean.toFixed(2)}).`
    }
  } else {
    if (reject) {
      interpretation = `There is a significant difference between the two groups (mean difference = ${sampleMean.toFixed(2)}).`
    } else {
      interpretation = `There is no significant difference between the two groups (mean difference = ${sampleMean.toFixed(2)}).`
    }
  }

  return {
    tStatistic,
    pValue,
    df,
    criticalValue,
    sampleMean,
    sampleSD,
    sampleSize,
    hypotheses,
    reject,
    conclusion,
    interpretation
  }
}