import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/**
 * Schema to validate login form
 */
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

/**
 * Login Page
 * @returns
 */
const LoginPage = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    // const { login } = useAuth();
    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        // login(values.email, values.password);
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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
                <a href="/register" className="px-24 py-2 hover:border-b-2 hover:border-white">
                    Register
                </a>
                <a href="login" className="px-24 py-2 bg-primary hover:bg-primary/90 border-b-2 border-white">
                    Login
                </a>
            </div>
            <h1 className="font-bold text-3xl">Login</h1>
            <span>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</span>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 lg:w-1/3 w-1/2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Email<span className="text-red-600 ml-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="name@exemple.com" {...field} />
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full rounded-none">
                        Login
                    </Button>
                </form>
            </Form>
            <span>
                Don&apos;t have an account?{' '}
                <a href="/register" className="underline">
                    Sign up
                </a>
            </span>
        </div>
    );
};

export default LoginPage;
