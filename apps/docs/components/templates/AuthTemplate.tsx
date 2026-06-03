'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormError,
  Input,
  Button,
  Checkbox,
  SegmentedControl,
  CardWrapper,
  Divider,
  Typography,
} from '@sagtech-infra/ui';

type Mode = 'login' | 'signup';

interface AuthForm {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const MODE_OPTIONS = [
  { label: 'Log in', value: 'login' },
  { label: 'Sign up', value: 'signup' },
];

const SOCIAL_PROVIDERS = ['Google', 'GitHub', 'Apple'];

export default function AuthTemplate() {
  const [mode, setMode] = useState<Mode>('login');
  const isSignup = mode === 'signup';

  const methods = useForm<AuthForm>({
    defaultValues: { email: '', password: '', confirmPassword: '', terms: false },
  });

  const onSubmit = methods.handleSubmit((data) => {
    // Self-contained demo: no real auth, just echo the payload.
    alert(`${isSignup ? 'Sign up' : 'Log in'}: ${JSON.stringify(data, null, 2)}`);
  });

  return (
    <div className="min-h-screen bg-bg-primary bg-surface-wash flex items-center justify-center px-16px py-48px">
      <div className="w-full max-w-[440px] flex flex-col gap-24px">
        <div className="flex flex-col gap-8px text-center">
          <Typography
            type="DisplayL"
            tag="h1"
            color="text-white_4"
            className="font-orbitron"
            text="SagTech"
          />
          <Typography
            type="BodyM"
            color="text-grey_4"
            text={
              isSignup
                ? 'Create your account to get started.'
                : 'Welcome back. Sign in to continue.'
            }
          />
        </div>

        <CardWrapper rounded="24" stoke="2" className="bg-bg-secondary">
          <div className="flex flex-col gap-24px p-32px">
            <SegmentedControl
              options={MODE_OPTIONS}
              value={mode}
              onChange={(next) => setMode(next as Mode)}
              size="md"
              fullWidth
              aria-label="Authentication mode"
            />

            <Form {...methods}>
              <form onSubmit={onSubmit} className="flex flex-col gap-16px">
                <FormField
                  control={methods.control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@company.com"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormError />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="password"
                  rules={{
                    required: 'Password is required',
                    minLength: { value: 8, message: 'At least 8 characters' },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          autoComplete={isSignup ? 'new-password' : 'current-password'}
                        />
                      </FormControl>
                      <FormError />
                    </FormItem>
                  )}
                />

                {isSignup && (
                  <FormField
                    control={methods.control}
                    name="confirmPassword"
                    rules={{
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === methods.getValues('password') ||
                        'Passwords do not match',
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormError />
                      </FormItem>
                    )}
                  />
                )}

                {isSignup ? (
                  <FormField
                    control={methods.control}
                    name="terms"
                    rules={{ required: 'You must accept the terms' }}
                    render={({ field }) => (
                      <FormItem>
                        <Checkbox
                          type="checkbox"
                          name="terms"
                          label="I agree to the Terms of Service and Privacy Policy"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <FormError />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="flex justify-end">
                    <Typography
                      type="Info"
                      tag="span"
                      color="text-pr_purple"
                      text="Forgot password?"
                    />
                  </div>
                )}

                <Button
                  text={isSignup ? 'Create account' : 'Log in'}
                  type="submit"
                  variant="primary"
                  buttonSize="large"
                  classes="w-full"
                />
              </form>
            </Form>

            <Divider variant="solid" label="or continue with" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12px">
              {SOCIAL_PROVIDERS.map((provider) => (
                <Button
                  key={provider}
                  text={provider}
                  variant="secondary"
                  buttonSize="small"
                  classes="w-full"
                  onClick={() => alert(`Continue with ${provider}`)}
                />
              ))}
            </div>
          </div>
        </CardWrapper>

        <div className="text-center">
          <Typography
            type="Info"
            color="text-grey_4"
            text={
              isSignup
                ? 'Already have an account? Switch to Log in above.'
                : "Don't have an account? Switch to Sign up above."
            }
          />
        </div>
      </div>
    </div>
  );
}
