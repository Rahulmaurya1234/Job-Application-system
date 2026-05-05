import { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleSend = () => {
        if (!email) {
            alert("Enter email first");
            return;
        }

        const subject = "Newsletter Subscription";
        const body = `Hi Rahul,\n\nPlease subscribe me to the newsletter.\n\nMy Email: ${email}`;

        window.location.href = `mailto:rahul2003maurya@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <footer className="bg-slate-950 text-slate-300 border-t border-purple-900/40 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
            <div className="mx-auto max-w-7xl space-y-12 px-6 py-16 lg:px-8">

                {/* GRID */}
                <div className="grid gap-8 md:grid-cols-4">

                    {/* Logo */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">CareerAI</h3>
                        <p className="text-sm text-slate-400">
                            AI-powered platform to match your skills with the best job opportunities.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                            Contact
                        </h4>
                        <p className="text-sm text-slate-400">+91 9696899410</p>
                        <p className="text-sm text-slate-400">contact@company.com</p>
                    </div>

                    {/* Links */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                            Quick Links
                        </h4>
                        <div className="space-y-2 text-sm text-slate-400">
                            <p className="transition hover:text-white cursor-pointer">Home</p>
                            <p className="transition hover:text-white cursor-pointer">About Us</p>
                            <p className="transition hover:text-white cursor-pointer">Terms & Conditions</p>
                            <p className="transition hover:text-white cursor-pointer">Contact Us</p>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                            Newsletter
                        </h4>
                        <p className="text-sm text-slate-400">
                            Subscribe for latest job updates.
                        </p>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                            />

                            <button
                                onClick={handleSend}
                                className="rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row">
                    <p>© 2026 CareerAI. All rights reserved.</p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="transition hover:text-white">
                            GitHub
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="transition hover:text-white">
                            LinkedIn
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="transition hover:text-white">
                            Instagram
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}