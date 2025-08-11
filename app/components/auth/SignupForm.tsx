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

// Icon
import { CircleX } from "lucide-react";
import useSignupForm from "~/hooks/auth/useSignupForm";

interface SignupFormProps {
  onSwitch: () => void;
}

export default function SignupForm({ onSwitch }: SignupFormProps) {
  const {
    email,
    password,
    username,
    setEmail,
    setPassword,
    setUsername,
    setConfirmPassword,
    loading,
    error,
    handleSignUp,
    setError,
  } = useSignupForm();

  return (
    <Card className="border border-gray-100 bg-white/80 w-full max-w-sm">
      <CardHeader>
        <CardTitle>Join Receiption today</CardTitle>
        <CardDescription>Sign up for a new account</CardDescription>
        <CardAction>
          <Button
            variant="link"
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              setError([]);
              onSwitch();
            }}
            disabled={loading}
          >
            Back to Login
          </Button>
        </CardAction>
      </CardHeader>
      <form onSubmit={handleSignUp}>
        <CardContent>
          <input type="hidden" name="action" value="signup" />
          <div className="flex flex-col gap-6">
            {/* Email input */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className="border border-gray-400 focus:border-gray-600"
                id="email"
                type="email"
                placeholder="John@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // if (error && e.target.validity.valid) setError("");
                }}
                onInvalid={(e) => {
                  // e.preventDefault(); // Stop default browser tooltip
                  // setError("Email must contain '@'");
                }}
                required
              />
            </div>
            {/* Username input */}

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                className="border border-gray-400 focus:border-gray-600"
                id="username"
                type="text"
                placeholder="John"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {/* Password */}
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
            {/* Confirm password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                className="border border-gray-400 focus:border-gray-600"
                id="password2"
                type="password"
                placeholder="**********"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>

        {/* Error alert */}
        <CardFooter className="flex-col gap-2 mt-4">
          {error.length > 0 && (
            <Alert variant="destructive" className="bg-transparent ">
              <CircleX />
              <AlertTitle>Unable to sign up</AlertTitle>
              <AlertDescription>
                {error.map((err, idx) => (
                  <div key={idx}>{err}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {/* Sign up */}
          <Button
            type="submit"
            className="w-full mt-2 bg-[#4077D0] hover:bg-[#3763BE] cursor-pointer"
            disabled={loading}
          >
            Sign Up
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
