"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { logo, robot } from "@/public/index";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function Login() {
  const { signIn, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "teacher@velam.ai",
      password: "123456",
    },
  });

  const onSubmit = async ({ email, password }: z.infer<typeof loginSchema>) => {
    try {
      const res = await signIn(email, password);
      if (res.status) {
        const callbackUrl =
          res.data.user?.role == "superadmin" ? "/dashboard" : "/classroom";
        router.push(callbackUrl);
        queryClient.invalidateQueries();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-row overflow-hidden">
      <div className="bg-[#4861D0] w-[40%] h-[100%] z-0">
        <Image
          src={logo}
          alt={"Logo"}
          className="w-[240px] mt-10 ml-12 mb-[10%]"
        />
        <Image
          src={robot}
          alt={"Robot Image"}
          className="w-[700px] absolute left-[15%] bottom-0"
        />
      </div>
      <div className="bg-login-bg bg-no-repeat bg-cover w-[70%] flex justify-center items-center">
        <div className="w-[600px] h-[80%] p-5 pl-10 flex flex-col items-start">
          <div className="font-bold text-[45px]">Welcome Back</div>
          <div className="text-left">Login to your account (new_)asha</div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-[60%] space-y-4 mt-5 z-50"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Enter your username or email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username or email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="*********"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loading ? (
                <Button disabled={loading} className="px-14 w-full">
                  <div role="status" className="mr-1">
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 text-muted mr-1 animate-spin fill-primary"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                  Sign in
                </Button>
              ) : (
                <Button disabled={loading} className="px-14 w-full">
                  Sign in
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
