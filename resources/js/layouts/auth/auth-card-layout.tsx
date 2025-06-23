import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <div className="mb-4 flex flex-col items-center justify-center">
                                <img src="/ched.png" alt="ched-logo" className="mb-3 h-20 w-20" />
                                <p className="text-xl font-bold">CHED Region XII Office</p>
                            </div>
                            <CardTitle className="">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-3">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
