"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {

    }

    return (
        <div className="min-h-screen w-full">
            <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Get in touch
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Have a question or need help? We'd love to hear from you. Send us a
                        message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Contact Grid */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Column - Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">
                                Contact information
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Fill out the form and our team will get back to you within 24
                                hours.
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-medium mb-1">Email</h3>
                                    <a
                                        href="mailto:info@dalabzone.com"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        info@dalabzone.com
                                    </a>
                                    <br />
                                    <a
                                        href="mailto:support@dalabzone.com"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        support@dalabzone.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-medium mb-1">Phone</h3>
                                    <a
                                        href="tel:+252619936001"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        +252619936001
                                    </a>
                                    <br />
                                    <a
                                        href="tel:+252611619990"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        +252611619990
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <MessageCircle className="h-5 w-5 text-green-500" />
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">WhatsApp</h3>

                                    <a
                                        href="https://wa.me/252619936001"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-green-500 transition-colors"
                                    >
                                        +252 61 9936001
                                    </a>
                                    <br />
                                    <a
                                        href="https://wa.me/252611619990"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-green-500 transition-colors"
                                    >
                                        +252 61 1619990
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="pt-6 border-t border-border">
                            <h3 className="font-medium mb-3">Business hours</h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <p>Satarday - Thursday: 8:00 AM - 6:00 PM</p>
                                {/* <p>Saturday: 10:00 AM - 4:00 PM</p>
                                <p>Sunday: Closed</p> */}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <Card className="p-5">
                        <form className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="first-name"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        First name
                                    </label>
                                    <Input
                                        id="first-name"
                                        placeholder="Mohamed"
                                        className="h-11"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="last-name"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Last name
                                    </label>
                                    <Input
                                        id="last-name"
                                        placeholder="Abdullahi"
                                        className="h-11"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@gmail.com"
                                    className="h-11"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="subject"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Subject
                                </label>
                                <Input
                                    id="subject"
                                    placeholder="How can we help you?"
                                    className="h-11"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    placeholder="Tell us more about your inquiry..."
                                    className="min-h-[150px] resize-y"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 gap-2 bg-brand-primary hover:bg-brand-primary/90 cursor-pointer text-white transition-all"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        Sending...

                                    </>
                                ) : (
                                    <>
                                        Send message
                                        <Send className="h-4 w-4" />
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                By submitting this form, you agree to our{" "}
                                <a
                                    href="#"
                                    className="underline underline-offset-4 hover:text-foreground"
                                >
                                    privacy policy
                                </a>
                                .
                            </p>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
