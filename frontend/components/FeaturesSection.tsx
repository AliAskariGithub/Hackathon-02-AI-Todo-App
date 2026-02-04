"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Shield, Smartphone, Globe, Layout, Palette } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "Lighting Fast",
        description: "Built with Next.js 16 for incredible speed and performance.",
        icon: Zap,
    },
    {
        title: "Secure by Design",
        description: "Enterprise-grade security to keep your data safe and private.",
        icon: Shield,
    },
    {
        title: "Fully Responsive",
        description: "Works perfectly on desktop, tablet, and mobile devices.",
        icon: Smartphone,
    },
    {
        title: "Global Sync",
        description: "Access your tasks from anywhere, anytime, on any device.",
        icon: Globe,
    },
    {
        title: "Intuitive Layout",
        description: "Clean, clutter-free interface designed for focus.",
        icon: Layout,
    },
    {
        title: "Premium Themes",
        description: "Beautiful dark and light modes with custom accent colors.",
        icon: Palette,
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 sm:py-32 bg-secondary/20">
            <div className="flex flex-col justify-center items-center px-4 md:px-6">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need to stay organized
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our platform provides all the tools you need to manage your tasks efficiently and elegantly.
                    </p>
                </div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={item}>
                            <Card className="h-full border-none shadow-sm hover:shadow-lg transition-shadow duration-300 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-muted-foreground/80">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
