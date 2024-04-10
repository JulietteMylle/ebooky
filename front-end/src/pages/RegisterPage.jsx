import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/**
 * Schema to validate register form
 */
const registerSchema = z
    .object({
        username: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        acceptTerms: z.boolean(),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        // TODO: Check password complexity
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords did not match',
            });
        }
    });

/**
 * Register Page
 * @returns
 */
const RegisterPage = () => {
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
    });
    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: values.username,
                email: values.email,
                password: values.password,
            }),
        });
        const data = await response.json();
        return data;
    };
    return (
        <div className="flex flex-col justify-center items-center gap-8 py-24 px-8">
            <div className="flex gap-1">
                <a href="/register" className="bg-primary hover:bg-primary/90 px-24 py-2 border-b-2 border-white">
                    Register
                </a>
                <a href="/login" className="px-24 py-2 hover:border-b-2 hover:border-white">
                    Login
                </a>
            </div>
            <h1 className="font-bold text-3xl">Registration</h1>
            <span>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</span>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 lg:w-1/3 w-1/2">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Username
                                    <span className="text-red-600 ml-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>This is your public display name.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Email<span className="text-red-600 ml-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Please enter your email address in the format &apos;name@example.com&apos;.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Password<span className="text-red-600 ml-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your password must be at least 8 characters long, includes both uppercase and
                                    lowercase letters, numbers, and symbols.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Confirm Password<span className="text-red-600 ml-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="acceptTerms"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center">
                                    <FormControl>
                                        <Checkbox
                                            className="mr-2"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>
                                        Accept terms and conditions<span className="text-red-600 ml-1">*</span>
                                    </FormLabel>
                                </div>

                                <FormDescription>You agree to our Terms of Service and Privacy Policy.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* TODO: Checkbox for newsletters */}

                    <Button type="submit" className="w-full rounded-none">
                        Register
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default RegisterPage;
