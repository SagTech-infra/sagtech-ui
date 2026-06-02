'use client';
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
} from '@sagtech-infra/ui';

interface SignInForm {
  email: string;
}

export default function Demo() {
  const methods = useForm<SignInForm>({ defaultValues: { email: '' } });
  return (
    <div className="w-full max-w-[480px]">
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) => alert(JSON.stringify(data)))}
          className="flex flex-col gap-16px"
        >
          <FormField
            control={methods.control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="you@company.com" />
                </FormControl>
                <FormError />
              </FormItem>
            )}
          />
          <Button text="Submit" type="submit" buttonSize="small" variant="primary" />
        </form>
      </Form>
    </div>
  );
}
