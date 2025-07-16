"use client"
import { useState } from "react"
import { registerUser, RegisterDto } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [form, setForm] = useState<RegisterDto>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const result = await registerUser(form);
      if (result.success) {
        setMessage("Registration successful!");
      } else {
        setMessage(result.message || "Something went wrong.");
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <Card>
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 w-full">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Join us</h1>
                <p className="text-muted-foreground text-balance">
                  Fill your details to create an account
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="firstName">Firstname</Label>
                  <Input id="firstName" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastName">Lastname</Label>
                  <Input id="lastName" value={form.lastName} onChange={handleChange} required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={form.username} onChange={handleChange} required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={form.password} onChange={handleChange} required />
                </div>
              </div>

              {message && (
                <p className="text-center text-sm text-red-600 dark:text-red-400">{message}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
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
    </div>
  );
}
