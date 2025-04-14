"use client";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { User, UserUpdateFormData } from "@/types/user";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import { toast } from "sonner";
import Cookies from "js-cookie";

export interface UserUpdateApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
}

const formSchema = z
  .object({
    name: z.string().min(2, "Name too short").max(20),
    email: z.string().email("Invalid email"),
    oldPassword: z.string().min(2, "Too short").max(20).optional(),
    newPassword: z.string().min(2, "Too short").max(20).optional(),
    confirmPassword: z.string().min(2, "Too short").max(20).optional(),
  })
  .refine(
    (data) => {
      const anyFilled =
        data.oldPassword || data.newPassword || data.confirmPassword;
      const allFilled =
        data.oldPassword?.length &&
        data.newPassword?.length &&
        data.confirmPassword?.length;

      if (anyFilled && !allFilled) return false;
      return true;
    },
    {
      message: "All password fields must be filled to change password.",
      path: ["oldPassword"],
    },
  )
  .refine(
    (data) => {
      if (!data.newPassword && !data.confirmPassword) return true;
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "New passwords do not match.",
      path: ["confirmPassword"],
    },
  );

const UserContainer = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<UserUpdateFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      oldPassword: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("email", user.email);
    }
  }, [user, form]);

  const { trigger } = useSWRMutation(
    `/users/${user?.id}`,
    async (url: string, { arg }: { arg: UserUpdateFormData }) => {
      return await axiosInstance.put<UserUpdateApiResponse>(url, arg);
    },
  );

  const onSubmit = async (values: UserUpdateFormData) => {
    try {
      setLoading(true);
      const response = await trigger(values);
      const user = response.data?.data;
      setUser(user);
      Cookies.set("user", JSON.stringify(user), { expires: 1 });
      toast.success("User updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Fail to update data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 max-w-xl mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Update Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Old Password */}
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Current password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="New password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repeat new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserContainer;
