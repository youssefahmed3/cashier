"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Calculator, Delete, RotateCcw } from "lucide-react"

export function POSCalculator() {
  const [display, setDisplay] = React.useState("0")
  const [previousValue, setPreviousValue] = React.useState<number | null>(null)
  const [operation, setOperation] = React.useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = React.useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay("0")
    }
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  // Quick calculation functions for common POS operations
  const calculateTax = (rate: number) => {
    const value = Number.parseFloat(display)
    const tax = value * (rate / 100)
    setDisplay(String((value + tax).toFixed(2)))
  }

  const calculateDiscount = (rate: number) => {
    const value = Number.parseFloat(display)
    const discount = value * (rate / 100)
    setDisplay(String((value - discount).toFixed(2)))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Calculator className="mr-2 h-8 w-8" />
            Calculator
          </h1>
          <p className="text-muted-foreground">Quick calculations for transactions and pricing</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display */}
            <Input value={display} readOnly className="text-right text-2xl font-mono h-16 text-lg" />

            {/* Calculator Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {/* Row 1 */}
              <Button variant="outline" onClick={clear} className="h-12 bg-transparent">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={backspace} className="h-12 bg-transparent">
                <Delete className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => performOperation("÷")} className="h-12">
                ÷
              </Button>
              <Button variant="outline" onClick={() => performOperation("×")} className="h-12">
                ×
              </Button>

              {/* Row 2 */}
              <Button variant="outline" onClick={() => inputNumber("7")} className="h-12">
                7
              </Button>
              <Button variant="outline" onClick={() => inputNumber("8")} className="h-12">
                8
              </Button>
              <Button variant="outline" onClick={() => inputNumber("9")} className="h-12">
                9
              </Button>
              <Button variant="outline" onClick={() => performOperation("-")} className="h-12">
                -
              </Button>

              {/* Row 3 */}
              <Button variant="outline" onClick={() => inputNumber("4")} className="h-12">
                4
              </Button>
              <Button variant="outline" onClick={() => inputNumber("5")} className="h-12">
                5
              </Button>
              <Button variant="outline" onClick={() => inputNumber("6")} className="h-12">
                6
              </Button>
              <Button variant="outline" onClick={() => performOperation("+")} className="h-12">
                +
              </Button>

              {/* Row 4 */}
              <Button variant="outline" onClick={() => inputNumber("1")} className="h-12">
                1
              </Button>
              <Button variant="outline" onClick={() => inputNumber("2")} className="h-12">
                2
              </Button>
              <Button variant="outline" onClick={() => inputNumber("3")} className="h-12">
                3
              </Button>
              <Button variant="default" onClick={handleEquals} className="h-12 row-span-2">
                =
              </Button>

              {/* Row 5 */}
              <Button variant="outline" onClick={() => inputNumber("0")} className="h-12 col-span-2">
                0
              </Button>
              <Button variant="outline" onClick={inputDecimal} className="h-12 bg-transparent">
                .
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick POS Functions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Functions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tax Calculations */}
            <div>
              <h3 className="font-semibold mb-2">Tax Calculations</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => calculateTax(8.5)} className="h-10">
                  +8.5% Tax
                </Button>
                <Button variant="outline" onClick={() => calculateTax(10)} className="h-10">
                  +10% Tax
                </Button>
              </div>
            </div>

            <Separator />

            {/* Discount Calculations */}
            <div>
              <h3 className="font-semibold mb-2">Discount Calculations</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => calculateDiscount(5)} className="h-10">
                  -5%
                </Button>
                <Button variant="outline" onClick={() => calculateDiscount(10)} className="h-10">
                  -10%
                </Button>
                <Button variant="outline" onClick={() => calculateDiscount(15)} className="h-10">
                  -15%
                </Button>
                <Button variant="outline" onClick={() => calculateDiscount(20)} className="h-10">
                  -20%
                </Button>
                <Button variant="outline" onClick={() => calculateDiscount(25)} className="h-10">
                  -25%
                </Button>
                <Button variant="outline" onClick={() => calculateDiscount(50)} className="h-10">
                  -50%
                </Button>
              </div>
            </div>

            <Separator />

            {/* Memory Functions */}
            <div>
              <h3 className="font-semibold mb-2">Memory</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-10 bg-transparent">
                  Store
                </Button>
                <Button variant="outline" className="h-10 bg-transparent">
                  Recall
                </Button>
              </div>
            </div>

            <Separator />

            {/* Current Result Display */}
            <div>
              <h3 className="font-semibold mb-2">Current Result</h3>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-mono font-bold">${Number.parseFloat(display).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Formatted as currency</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
