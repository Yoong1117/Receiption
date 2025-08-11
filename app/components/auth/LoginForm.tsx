// UI Components
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";

// Icon
import { CircleX } from "lucide-react";
import useLoginForm from "~/hooks/auth/useLoginForm";

interface LoginFormProps {
  onSwitch: () => void;
}

export default function LoginForm({ onSwitch }: LoginFormProps) {
  const {
    email,
    password,
    setEmail,
    setPassword,
    loading,
    error,
    handleLogin,
    handleGoogleSignIn,
    setError,
  } = useLoginForm();

  return (
    <>
      {" "}
      <Card className="border border-gray-100 w-full max-w-sm bg-white/80 ">
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Login to your account</CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="cursor-pointer text-blue-600"
              disabled={loading}
              onClick={() => {
                setError([]);
                onSwitch();
              }}
            >
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleLogin} autoComplete="off">
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className=" text-black border border-gray-400 focus:border-gray-600"
                  id="email"
                  type="email"
                  placeholder="John@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  className="border border-gray-400 focus:border-gray-600"
                  id="password"
                  type="password"
                  placeholder="**********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-4">
            {error.length > 0 && (
              <Alert variant="destructive" className="bg-transparent">
                <CircleX />
                <AlertTitle>Unable to Login</AlertTitle>
                <AlertDescription>
                  {error.map((err, idx) => (
                    <div key={idx}>{err}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className={`bg-[#4077D0] hover:bg-[#3763BE] w-full cursor-pointer ${error.length > 0 ? "mt-2" : "mt-4"}`}
              disabled={loading}
            >
              Login
            </Button>

            <a
              href="#"
              className="ml-auto mt-2 inline-block text-xs text-blue-600 underline-offset-4 hover:underline "
            >
              Forgot your password?
            </a>
          </CardFooter>
        </form>

        <Separator />

        <CardFooter className="flex-col gap-2">
          <Label className="text-xs mb-2">Or</Label>
          <Button
            variant="outline"
            className="border border-gray-100 w-full cursor-pointer bg-white/10"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
