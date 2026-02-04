export function Footer() {
    return (
        <footer className="border-t bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xs">T</span>
                        </div>
                        <span className="font-semibold text-lg">TodoApp</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} TodoApp. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
