import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormHint, FormError } from './Form';
import Input from '@/components/Input/Input';
import { TextArea } from '@/components/TextArea/TextArea';
import Toggle from '@/components/Toggle/Toggle';
import Checkbox from '@/components/Checkbox/Checkbox';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Form Controls/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-full min-h-105 py-32px">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

interface ProfileForm {
  displayName: string;
  bio: string;
  notifications: boolean;
}

export const Basic: Story = {
  name: 'Basic form (input + textarea + toggle)',
  render: function BasicStory() {
    const methods = useForm<ProfileForm>({
      defaultValues: { displayName: '', bio: '', notifications: true },
    });
    return (
      <div className="w-full max-w-105">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit((data) => {
              alert(JSON.stringify(data, null, 2));
            })}
            className="flex flex-col gap-16px"
          >
            <FormField
              control={methods.control}
              name="displayName"
              rules={{ required: 'Display name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ada Lovelace" />
                  </FormControl>
                  <FormHint>What teammates see in mentions and assignments.</FormHint>
                  <FormError />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="bio"
              rules={{ maxLength: { value: 160, message: 'Keep it under 160 chars' } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <TextArea {...field} rows={3} placeholder="Short bio" />
                  </FormControl>
                  <FormError />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="notifications"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Email notifications</FormLabel>
                    <Toggle checked={field.value} onChange={field.onChange} />
                  </div>
                </FormItem>
              )}
            />
            <Button text="Save" type="submit" buttonSize="small" variant="primary" />
          </form>
        </Form>
      </div>
    );
  },
};

interface SignInForm {
  email: string;
  password: string;
  remember: boolean;
}

export const SignIn: Story = {
  name: 'Sign in (with validation)',
  render: function SignInStory() {
    const methods = useForm<SignInForm>({
      defaultValues: { email: '', password: '', remember: false },
      mode: 'onBlur',
    });
    return (
      <div className="w-[380px]">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit((data) => {
              alert(`Sign in:\n${JSON.stringify(data, null, 2)}`);
            })}
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
                    <Input {...field} type="password" placeholder="••••••••" />
                  </FormControl>
                  <FormHint>Min 8 characters. We never store it in plain text.</FormHint>
                  <FormError />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="remember"
              render={({ field }) => (
                <FormItem>
                  <Checkbox
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    label="Keep me signed in"
                  />
                </FormItem>
              )}
            />
            <Button text="Sign in" type="submit" buttonSize="small" variant="primary" />
          </form>
        </Form>
      </div>
    );
  },
};

interface FeedbackForm {
  subject: string;
  rating: string;
  message: string;
  contactable: boolean;
}

export const Feedback: Story = {
  name: 'Feedback (mixed controls + async submit)',
  render: function FeedbackStory() {
    const methods = useForm<FeedbackForm>({
      defaultValues: { subject: '', rating: '', message: '', contactable: true },
    });
    const { isSubmitting } = methods.formState;
    return (
      <div className="w-[460px]">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(async (data) => {
              await new Promise((r) => setTimeout(r, 800));
              alert(`Submitted:\n${JSON.stringify(data, null, 2)}`);
            })}
            className="flex flex-col gap-16px"
          >
            <FormField
              control={methods.control}
              name="subject"
              rules={{ required: 'Subject is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="What is this about?" />
                  </FormControl>
                  <FormError />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="rating"
              rules={{ required: 'Pick a rating' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How was your experience?</FormLabel>
                  <FormControl>
                    <div className="flex gap-8px">
                      {['1', '2', '3', '4', '5'].map((n) => {
                        const active = field.value === n;
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => field.onChange(n)}
                            className={`w-[40px] h-[40px] rounded-[50px] border border-solid cursor-pointer font-manrope text-14 transition-colors ${
                              active
                                ? 'bg-pr_purple border-pr_purple text-white_4'
                                : 'bg-transparent border-grey_1 text-grey_4 hover:border-white_4 hover:text-white_4'
                            }`}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormError />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="message"
              rules={{
                required: 'Tell us a little more',
                minLength: { value: 10, message: 'At least 10 characters' },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <TextArea {...field} rows={4} placeholder="Details, steps, what you expected…" />
                  </FormControl>
                  <FormError />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="contactable"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <div>
                      <FormLabel>Allow follow-up</FormLabel>
                      <FormHint>We may reach out for clarification.</FormHint>
                    </div>
                    <Toggle checked={field.value} onChange={field.onChange} />
                  </div>
                </FormItem>
              )}
            />
            <Button
              text={isSubmitting ? 'Sending…' : 'Send feedback'}
              type="submit"
              buttonSize="small"
              variant="primary"
              loadingType={isSubmitting}
              disabled={isSubmitting}
            />
          </form>
        </Form>
      </div>
    );
  },
};
