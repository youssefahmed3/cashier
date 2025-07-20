"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { validateResetCode } from "@/lib/api"

export function ValidateResetPasswordCodeForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const email = typeof window !== "undefined" ? localStorage.getItem("user-email") : null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error("Email not found. Please restart the process.")
            return
        }

        if (code.length !== 6) {
            toast.error("Please enter a 6-digit code.")
            return
        }

        setLoading(true)
        try {
            const res = await validateResetCode({ email, verificationCode: code })
            if (res.success) {
                toast.success("Code verified. You can now reset your password.")
                localStorage.setItem("reset-code", code)
                router.push("/resetPassword")
            } else {
                toast.error(res.message || "Invalid code.")
            }
        } catch (err) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Verification Code</h1>
                                <p className="text-muted-foreground text-balance">
                                    Please enter the verification code to reset your password
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <div className="grid gap-3 w-full max-w-sm text-center">
                                    <div className="flex items-center justify-center">
                                        <InputOTP
                                            maxLength={6}
                                            value={code}
                                            onChange={(val) => setCode(val)}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Verifying..." : "Confirm"}
                            </Button>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/login-image.jpg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
