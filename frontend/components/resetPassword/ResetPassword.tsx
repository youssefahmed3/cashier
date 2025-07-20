"use client"

import { useState, useEffect } from "react"
import { resetPassword, ResetPasswordDto } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"

export function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")

    useEffect(() => {
        const storedEmail = localStorage.getItem("user-email") || ""
        const storedCode = localStorage.getItem("reset-code") || ""
        setEmail(storedEmail)
        setCode(storedCode)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        const dto: ResetPasswordDto = { email, code, newPassword }
        const result = await resetPassword(dto)

        if (result.success) {
            toast.success("Password reset successfully")
            localStorage.setItem("token", result.token);
            localStorage.setItem("refresh-token", result.refreshToken);
            //We will redirect to dashboard 
            localStorage.removeItem("user-email")
            localStorage.removeItem("reset-code")
        } else {
            toast.error(result.message || "Failed to reset password")
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardContent className="grid md:grid-cols-2 p-0">
                    <form className="p-6 md:p-8 w-full" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold">Reset password</h1>
                                <p className="text-muted-foreground">Enter a new password for your account</p>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="new-password">New password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="confirm-password">Confirm password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Confirm
                            </Button>
                        </div>
                    </form>

                    <div className="bg-muted hidden md:block relative">
                        <img
                            src="/login-image.jpg"
                            alt="Image"
                            className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
