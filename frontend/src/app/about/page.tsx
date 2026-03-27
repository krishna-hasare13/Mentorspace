'use client';

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import FooterSection from "@/components/layout/Footer";
import { Zap, Layout, Terminal, BookOpen, Settings, Accessibility, Bot, Users, Video } from "lucide-react";

const aboutFeatures = [
    {
        icon: Video,
        title: "High-Quality Real-time Video",
        description: "Experience crystal-clear communication with our advanced WebRTC integration, optimized for minimal latency."
    },
    {
        icon: Terminal,
        title: "Collaborative Code Editor",
        description: "Write and debug code together in real-time with our synchronized Monaco editor and integrated execution engine."
    },
    {
        icon: Users,
        title: "Expert Mentorship",
        description: "Connect with industry professionals who are passionate about sharing their knowledge and guiding your growth."
    },
    {
        icon: Bot,
        title: "AI-Enhanced Learning",
        description: "Get smart summaries of your sessions and personalized insights to track your learning progress over time."
    },
    {
        icon: Settings,
        title: "Fully Customizable Sessions",
        description: "Tailor your learning environment with flexible tools, language selection, and interactive features."
    },
    {
        icon: Accessibility,
        title: "Inclusion & Accessibility",
        description: "Built with modern standards to ensure everyone has access to quality mentorship, regardless of their background."
    }
];

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-40 pb-20">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        About <span className="text-primary">MentorSpace</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto">
                        We are building the world's most immersive and interactive mentorship platform, 
                        where intention, emotion, and technical style meet to create life-changing learning experiences.
                    </p>
                </motion.div>

                <div className="relative mt-24">
                    {/* Background Blur Effect centered like the example */}
                    <div className="size-[500px] -top-80 left-1/2 -translate-x-1/2 rounded-full absolute blur-[150px] -z-10 bg-primary/10"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
                        {aboutFeatures.map((feature, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="size-14 p-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                                    <feature.icon className="w-7 h-7 text-primary" />
                                </div>
                                <div className="mt-8 space-y-3">
                                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-base text-white/40 leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-40">
                <FooterSection />
            </div>
        </main>
    );
}
