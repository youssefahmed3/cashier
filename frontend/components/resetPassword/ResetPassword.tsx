"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Reset password</h1>
                                <p className="text-muted-foreground text-balance">
                                    Please enter your new password to reset your account
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <div className="grid gap-3 w-full max-w-sm text-center">
                                    <div className="grid gap-3 w-full">
                                        <Label htmlFor="new-password">New password</Label>
                                        <Input
                                            id="new-password"
                                            type="text"
                                            placeholder="Enter new password"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-3 w-full max-w-sm text-center">
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="confirm-new-password">Confirm New password</Label>
                                    <Input
                                        id="confirm-new-password"
                                        type="text"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">
                                Confirm
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
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
