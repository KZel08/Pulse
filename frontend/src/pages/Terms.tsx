import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/LandingHeader';

interface TermsPageProps {}

const Terms: React.FC<TermsPageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* ContainerScroll Hero */}
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Terms of <br />
                <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                  Service
                </span>
              </h1>
            </>
          }
        >
          <div className="w-full h-full bg-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
            <div className="text-white text-center space-y-4">
              <div className="text-xl font-bold">Last Updated: {new Date().toLocaleDateString()}</div>
              <div className="text-lg text-zinc-300">By using Pulse you agree to these terms</div>
              <div className="text-sm text-zinc-400 max-w-md">
                Please read these terms carefully as they govern your use of our secure communication platform
              </div>
            </div>
          </div>
        </ContainerScroll>

        <div className="max-w-4xl mx-auto mt-16">

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using Pulse ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Pulse Chat Inc. ("Pulse", "we", "us", or "our") provides the Service, including but not limited to, secure messaging, AI-powered content monitoring, ghost mode functionality, and related features subject to the following Terms of Service ("Terms").
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Use of Service
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Transmit any content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
                <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
                <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                <li>Attempt to gain unauthorized access to the Service, user accounts, or computer systems</li>
                <li>Use the Service to violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Ghost Mode Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pulse offers a "Ghost Mode" feature that allows users to communicate with enhanced privacy protections. When using Ghost Mode:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>User identity information is masked from other participants</li>
                <li>Messages are still subject to AI safety monitoring as per our content policies</li>
                <li>Ghost Mode communications are still subject to lawful requests and legal compliance requirements</li>
                <li>Users remain responsible for their content even when using Ghost Mode</li>
                <li>Enterprise administrators may have different access levels based on their subscription tier</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Ghost Mode is designed for enhanced privacy, not for illegal activities. All users must still comply with applicable laws and our content policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We retain user data and message content according to the following policies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Free Tier:</strong> Messages are retained for 30 days</li>
                <li><strong>Pro Tier:</strong> Messages are retained for 90 days</li>
                <li><strong>Enterprise Tier:</strong> Custom retention periods as specified in your enterprise agreement</li>
                <li><strong>Deleted Messages:</strong> Permanently deleted within 24 hours, subject to legal holds</li>
                <li><strong>Metadata:</strong> Basic metadata (timestamps, user counts) may be retained longer for service optimization</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Message content is encrypted at rest and in transit. We implement industry-standard security measures to protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. AI Safety Monitoring
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pulse employs AI-powered content monitoring to ensure a safe and compliant communication environment. This includes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Automated detection of harmful, illegal, or policy-violating content</li>
                <li>Real-time content filtering and warning systems</li>
                <li>Enterprise-grade compliance monitoring for regulated industries</li>
                <li>Custom policy enforcement based on organizational requirements</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Our AI systems are designed to respect privacy while maintaining safety. Content monitoring is performed using automated systems, and human review only occurs when necessary for safety or compliance purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Pulse Chat Inc. and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of any content you create or share through the Service. However, you grant Pulse a worldwide, non-exclusive, royalty-free license to use, process, and analyze your content solely for the purpose of providing and improving the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Termination
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Upon termination, your right to use the Service will cease immediately. All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Enterprise customers may be subject to different termination terms as specified in their enterprise agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall Pulse Chat Inc., its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms will be resolved in the courts of San Francisco, California.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the effective date of the changes. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Email: legal@pulsechat.com<br />
                Address: Pulse Chat Inc., San Francisco, CA 94105
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;