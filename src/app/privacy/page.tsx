'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from '../../../components/ui/sparkles';
import { TimelineContent } from '../../../components/ui/timeline-animation';

export default function PrivacyPage() {
  const pageRef = useRef<HTMLDivElement | null>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden" ref={pageRef}>
      {/* Background Effects */}
      <TimelineContent
        animationNum={4}
        timelineRef={pageRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden z-0 [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]"></div>
        <Sparkles
          density={1800}
          speed={1}
          color="#FFFFFF"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>
      <TimelineContent
        animationNum={5}
        timelineRef={pageRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-114px] w-full h-[113.625vh] flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0"
      >
        <div className="framer-1i5axl2">
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid #333333",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
            data-border="true"
            data-framer-name="Ellipse 1"
          ></div>
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid #333333",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
            data-border="true"
            data-framer-name="Ellipse 2"
          ></div>
        </div>
      </TimelineContent>

      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #333333 0%, transparent 70%)
          `,
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />

      <main className="mx-auto max-w-3xl px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-8 text-white">
            Privacy Policy
          </h1>

          <div className="prose prose-invert prose-lg max-w-none text-slate-300">
            <p className="text-sm text-gray-400 mb-8">
              Last updated: March 15, 2026
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, update your profile, use our services, or communicate with us. This may include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Account credentials (username, password)</li>
                    <li>Payment and billing information</li>
                    <li>Client and project information you choose to store</li>
                    <li>Communications with our support team</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Develop new products and services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and audits</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Secure data storage facilities</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Retention</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy. When you delete your account, we will delete or anonymize your personal information, except where we need to retain it for legal, regulatory, or legitimate business purposes.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and receive a copy of your personal information</li>
                    <li>Rectify inaccurate or incomplete information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Object to processing of your personal information</li>
                    <li>Request restriction of processing</li>
                    <li>Data portability</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <p className="leading-relaxed">
                    Email: privacy@freelanceflow.com<br />
                    Address: 123 Freelance Street, San Francisco, CA 94102
                  </p>
                </div>
              </section>
            </div>

            
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-400">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 relative mr-2">
              <Image
                src="/logo.png"
                alt="Freelance Flow Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">Freelance Flow</span>
          </div>
          <p>© 2026 Freelance Flow. All rights reserved.</p>
          <p className="mt-2 text-sm">Designed for freelancers, by freelancers</p>
        </div>
      </footer>
    </div>
  );
}