import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { BookOpen, Calculator } from "@phosphor-icons/react"
import CheatSheet from "@/components/CheatSheet"
import TTestCalculator from "@/components/TTestCalculator"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Hypothesis Testing
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Interactive guide to statistical hypothesis testing and T-tests
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <Tabs defaultValue="cheatsheet" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="cheatsheet" className="text-base gap-2">
              <BookOpen size={20} weight="duotone" />
              <span className="hidden sm:inline">Cheat Sheet</span>
              <span className="sm:hidden">Reference</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="text-base gap-2">
              <Calculator size={20} weight="duotone" />
              <span className="hidden sm:inline">T-Test Calculator</span>
              <span className="sm:hidden">Calculator</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cheatsheet" className="mt-8">
            <CheatSheet />
          </TabsContent>

          <TabsContent value="calculator" className="mt-8">
            <TTestCalculator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App