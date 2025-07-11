interface HeadingProps {
    title: string;
    description: string | null;
}

export function Heading({ title, description }: HeadingProps) {
    return (
        <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        </header>
    );  



    

}
