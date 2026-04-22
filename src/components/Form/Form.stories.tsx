import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormHint, FormError } from './Form';
import Input from '@/components/Input/Input';
import TextArea from '@/components/TextArea/TextArea';
import Toggle from '@/components/Toggle/Toggle';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Form Controls/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
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
      <div className="w-[420px]">
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
