"use client";
import CustomButton from "@/components/Button/Button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Save } from "lucide-react";
import React from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  SystemName: z.string().min(2, {
    message: "System Name must be at least 2 characters.",
  }),
  contactEmail: z.email(),
  businessAddress: z.string().min(5, {
    message: "Business Address must be at least 5 characters.",
  }),
  basicPlanPrice: z.number().min(0, {
    message: "Basic Plan Price must be a positive number.",
  }),
  premiumPlanPrice: z.number().min(0, {
    message: "Premium Plan Price must be a positive number.",
  }),
  enterprisePlanPrice: z.number().min(0, {
    message: "Enterprise Plan Price must be a positive number.",
  }),
  gracePeriod: z.string().min(1, {
    message: "Please select a grace period.",
  }),
});

const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      SystemName: "",
      contactEmail: "",
      businessAddress: "",
      basicPlanPrice: 0,
      premiumPlanPrice: 0,
      enterprisePlanPrice: 0,
      gracePeriod: "7",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="container-base">
      <header className="flex flex-col gap-6">
        {/* Welcome Message and the Title With a Button */}
        <div className="flex items-center justify-between">
          <section>
            <h1 className="text-2xl font-bold m">Settings</h1>
            <p className="text-muted-foreground">
              Configure your supermarket chain settings and preferences.
            </p>
          </section>
          {/* Button outside the form, but linked via form attribute */}
          <CustomButton
            title="Save Changes"
            icon={<Save />}
            type="submit"
            form="settings-form"
          />
        </div>
      </header>

      <main className="flex flex-col gap-6">
        <section>
          <Card className="w-full">
            <CardHeader className="flex flex-col">
              <CardTitle className="text-2xl font-bold">
                General Settings
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-center">
                Manage your account and general preferences
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  id="settings-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <FormField
                      control={form.control}
                      name="SystemName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>System Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your beautiful System's name...."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="businessAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Input placeholder="example address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="w-full">
            <CardHeader className="flex flex-col">
              <CardTitle className="text-2xl font-bold">
                Billing & Subscription Settings
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-center">
                Configure billing cycles and subscription plans
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  id="settings-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <FormField
                      control={form.control}
                      name="basicPlanPrice"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Basic Plan Price</FormLabel>
                          <FormControl>
                            <Input placeholder="Basic Plan Price" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="premiumPlanPrice"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Premium Plan Price</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Premium Plan Price"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enterprisePlanPrice"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Enterprise PlanPrice</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enterprise Plan Price"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="gracePeriod"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>
                            Grace Period for Failed Payments
                          </FormLabel>
                          <FormDescription>
                            Days before suspending service
                          </FormDescription>
                        </div>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Page;
