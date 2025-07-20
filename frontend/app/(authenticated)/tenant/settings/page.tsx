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

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company Name must be at least 2 characters.",
  }),
  contactEmail: z.email(),
  businessAddress: z.string().min(5, {
    message: "Business Address must be at least 5 characters.",
  }),
});

const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
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
        {/* Recent Activities & Quick Actions  */}

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
                      name="companyName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your beautiful company's name...."
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

        {/* Branches Management */}
        <section></section>
      </main>
    </div>
  );
};

export default Page;
