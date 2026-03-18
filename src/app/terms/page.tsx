'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from '../../../components/ui/sparkles';
import { TimelineContent } from '../../../components/ui/timeline-animation';

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <div className="prose prose-invert prose-lg max-w-none text-slate-300">
            <p className="text-sm text-gray-400 mb-8">
              Last updated: March 15, 2026
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    By accessing or using Freelance Flow's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                  </p>
                  <p className="leading-relaxed">
                    We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. User Accounts</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    To access certain features of our service, you must register for an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your password and account</li>
                    <li>Accept responsibility for all activities that occur under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Subscription and Billing</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    Freelance Flow offers both free and paid subscription plans. By subscribing to a paid plan, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Pay all fees associated with your subscription plan</li>
                    <li>Provide accurate billing information</li>
                    <li>Authorize us to charge your payment method on a recurring basis</li>
                    <li>Accept that subscriptions automatically renew unless cancelled</li>
                  </ul>
                  <p className="leading-relaxed">
                    You may cancel your subscription at any time. Refunds are handled on a case-by-case basis according to our refund policy.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    You agree not to use Freelance Flow to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon the rights of others</li>
                    <li>Transmit harmful, offensive, or illegal content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the service</li>
                    <li>Use the service for any fraudulent or deceptive practices</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    Freelance Flow and its original content, features, and functionality are owned by Freelance Flow and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p className="leading-relaxed">
                    You retain ownership of any content you submit to Freelance Flow. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content in connection with our services.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    To the maximum extent permitted by law, Freelance Flow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Termination</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms of Service.
                  </p>
                  <p className="leading-relaxed">
                    Upon termination, your right to use the service will immediately cease. All provisions of these Terms of Service which should reasonably survive termination shall survive.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Contact Information</h2>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <p className="leading-relaxed">
                    Email: legal@freelanceflow.com<br />
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