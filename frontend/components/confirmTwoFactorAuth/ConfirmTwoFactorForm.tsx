"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { confirm2FA } from "@/lib/api/auth"
import { useState } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

export function ConfirmTwoFactorForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const storedEmail = localStorage.getItem("2fa-email");
        if (storedEmail) setEmail(storedEmail);
    }, []);

const {
  confirm2FA,
  confirm2FAStatus,
  confirm2FAError,
  isConfirm2FALoading
} = useAuth()

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  setMessage("")
  confirm2FA({ email, code })
}
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     setLoading(true)
    //     setMessage("")

    //     try {
    //         const result = await confirm2FA({ email, code })

    //         if (result.success) {
    //             localStorage.removeItem("2fa-email");
    //             localStorage.setItem("token", result.token);
    //             localStorage.setItem("refresh-token", result.refreshToken);
    //             setMessage("2FA confirmed successfully!")
    //             //Redirect to the dashboard 
    //         } else {
    //             setMessage(result.message || "Invalid code")
    //         }
    //     } catch (error) {
    //         setMessage("Server error")
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Verification code</h1>
                                <p className="text-muted-foreground text-balance">
                                    Please enter verification code to confirm your account
                                </p>
                            </div>

                            <div className="flex justify-center items-center w-full">
                                <div className="flex justify-center">

                                    <InputOTP maxLength={6} value={code} onChange={setCode}>
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

                           <Button type="submit" disabled={isConfirm2FALoading}>
  {isConfirm2FALoading ? "Confirming..." : "Confirm"}
</Button>

{confirm2FAError && (
  <p className="text-center text-sm text-red-600">
    {confirm2FAError.message || "2FA failed"}
  </p>
)}

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

            <div className="text-muted-foreground text-center text-xs text-balance">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline hover:text-primary">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
            </div>
        </div>
    )
}
