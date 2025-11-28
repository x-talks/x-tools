import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="border-b border-slate-200 bg-white shadow-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600" />
                        <span className="text-xl font-bold tracking-tight text-slate-900">Team Identity Wizard</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        v1.0.0 (Deterministic)
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t border-slate-200 bg-white py-6">
                <div className="container mx-auto px-4 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Team Identity Wizard. Open Source & Compliant.
                </div>
            </footer>
        </div>
    );
}
