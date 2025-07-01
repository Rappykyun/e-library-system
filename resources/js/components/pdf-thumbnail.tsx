import { BookOpen } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfThumbnailProps {
    pdfUrl: string;
    title: string;
    className?: string;
}

export function PdfThumbnail({ pdfUrl, title, className = '' }: PdfThumbnailProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const generateThumbnail = async () => {
            if (!canvasRef.current || !pdfUrl) return;

            try {
                setIsLoading(true);
                setHasError(false);

                // Load the PDF
                const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

                // Get the first page
                const page = await pdf.getPage(1);

                // Set up canvas
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                if (!context) return;

                // Calculate scale to fit 400x600 thumbnail
                const viewport = page.getViewport({ scale: 1 });
                const scale = Math.min(400 / viewport.width, 600 / viewport.height);
                const scaledViewport = page.getViewport({ scale });

                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;

                // Render the page
                await page.render({
                    canvasContext: context,
                    viewport: scaledViewport,
                }).promise;

                setIsLoading(false);
            } catch (error) {
                console.error('Error generating PDF thumbnail:', error);
                setHasError(true);
                setIsLoading(false);
            }
        };

        generateThumbnail();
    }, [pdfUrl]);

    if (isLoading) {
        return (
            <div className={`flex h-full w-full items-center justify-center bg-muted ${className}`}>
                <div className="text-center">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div
                className={`flex h-full w-full flex-col items-center justify-center bg-secondary p-4 text-center text-secondary-foreground ${className}`}
            >
                <BookOpen className="mb-2 h-8 w-8" />
                <p className="line-clamp-3 font-semibold">{title}</p>
            </div>
        );
    }

    return <canvas ref={canvasRef} className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${className}`} />;
}
