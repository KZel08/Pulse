import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/LandingHeader';

interface PrivacyPageProps {}

const Privacy: React.FC<PrivacyPageProps> = () => {
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
                Your Privacy, <br />
                <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                  Our Priority
                </span>
              </h1>
            </>
          }
        >
          <div className="w-full h-full bg-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
            <div className="grid grid-cols-1 gap-6 text-white w-full">
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-green-400">Zero-Knowledge Architecture</div>
                <div className="text-sm text-zinc-400">We can't access your messages even if we wanted to</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-blue-400">No Data Selling</div>
                <div className="text-sm text-zinc-400">Your data is never sold or shared with third parties</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-purple-400">GDPR Compliant</div>
                <div className="text-sm text-zinc-400">Full compliance with international privacy regulations</div>
              </div>
            </div>
          </div>
        </ContainerScroll>

        <div className="max-w-4xl mx-auto mt-16">

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Data We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information necessary to provide and improve our secure communication services:
              </p>
              
              <div className="bg-muted/50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  Message Content
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-7">
                  <li>Text messages, file attachments, and media shared in chats</li>
                  <li>Message timestamps and metadata</li>
                  <li>Chat room information and participant lists</li>
                  <li>Content is encrypted end-to-end for security</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-primary" />
                  Usage Data
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-7">
                  <li>App usage patterns and feature interactions</li>
                  <li>Performance metrics and error reports</li>
                  <li>AI safety monitoring analytics (anonymized)</li>
                  <li>Session duration and frequency statistics</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-primary" />
                  Device Information
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-7">
                  <li>Device type and operating system</li>
                  <li>Browser information and app version</li>
                  <li>IP address and general location (country/region level)</li>
                  <li>Unique device identifiers for security purposes</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. How We Use Your Data
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use your data to provide, maintain, and improve our services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Service Delivery:</strong> To transmit messages, manage chats, and provide core functionality</li>
                <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security threats</li>
                <li><strong>AI Safety:</strong> To power our content monitoring and safety features</li>
                <li><strong>Analytics:</strong> To understand usage patterns and improve user experience</li>
                <li><strong>Support:</strong> To provide customer support and troubleshoot issues</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Ghost Mode Anonymity Guarantees
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ghost Mode provides enhanced privacy protections:
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3">Ghost Mode Protections</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Identity Masking:</strong> User names and profile information are hidden from other participants</li>
                  <li><strong>Enhanced Encryption:</strong> Additional encryption layers for Ghost Mode communications</li>
                  <li><strong>Limited Metadata:</strong> Reduced metadata collection and retention</li>
                  <li><strong>No Tracking:</strong> Ghost Mode conversations are not used for analytics or training</li>
                </ul>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Important:</strong> Ghost Mode still complies with legal requirements and may be subject to lawful requests. All users must comply with our content policies regardless of mode.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Third-Party Sharing Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal data. We only share data in limited circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Service Providers:</strong> With trusted third-party providers who help operate our service (e.g., cloud infrastructure, security services)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>Safety:</strong> To prevent harm, fraud, or illegal activity</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                All third-party sharing is governed by strict data protection agreements and limited to what is necessary for the specified purpose.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement industry-leading security measures:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>End-to-End Encryption:</strong> All messages are encrypted in transit and at rest</li>
                <li><strong>Secure Infrastructure:</strong> Enterprise-grade security controls and monitoring</li>
                <li><strong>Access Controls:</strong> Strict employee access limitations and audit logging</li>
                <li><strong>Regular Audits:</strong> Independent security assessments and penetration testing</li>
                <li><strong>Compliance:</strong> SOC 2, GDPR, and industry-specific compliance standards</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We retain data according to our retention policies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Free Tier:</strong> 30 days for message content</li>
                <li><strong>Pro Tier:</strong> 90 days for message content</li>
                <li><strong>Enterprise:</strong> Custom retention periods</li>
                <li><strong>Deleted Content:</strong> Removed within 24 hours (subject to legal holds)</li>
                <li><strong>Analytics Data:</strong> Anonymized and retained for service improvement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Your Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the following rights regarding your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Objection:</strong> Object to certain data processing activities</li>
                <li><strong>Restriction:</strong> Limit processing of your data in certain circumstances</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, contact us at privacy@pulsechat.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. International Data Transfers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services may involve transferring data internationally. We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses and other legal mechanisms as required by applicable law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and, where required by law, obtaining your consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Email: privacy@pulsechat.com<br />
                Address: Pulse Chat Inc., San Francisco, CA 94105<br />
                Phone: 1-800-PULSE-AI
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;