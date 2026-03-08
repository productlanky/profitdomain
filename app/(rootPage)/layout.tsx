import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo';
import Footer from '@/components/RootComponents/Footer';
import Navbar from '@/components/RootComponents/Navbar';
import React from 'react'

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
            <div id='print' className="fixed bottom-24 right-6 z-50 hidden sm:block">
                <ThemeTogglerTwo />
            </div>
        </>
    )
}
