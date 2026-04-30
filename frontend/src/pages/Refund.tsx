import React from 'react';
import { ArrowLeft, CreditCard, Calendar, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/LandingHeader';

interface RefundPageProps {}

const Refund: React.FC<RefundPageProps> = () => {
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
                14-Day <br />
                <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                  Money-Back Guarantee
                </span>
              </h1>
            </>
          }
        >
          <div className="w-full h-full bg-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
            <div className="grid grid-cols-1 gap-6 text-white w-full">
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-green-400">Full Refund</div>
                <div className="text-sm text-zinc-400">Get 100% of your money back within 14 days</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-blue-400">No Questions Asked</div>
                <div className="text-sm text-zinc-400">Simple, hassle-free refund process</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-purple-400">Pro Plan Only</div>
                <div className="text-sm text-zinc-400">Money-back guarantee applies to Pro plan subscriptions</div>
              </div>
            </div>
          </div>
        </ContainerScroll>

        <div className="max-w-4xl mx-auto mt-16">

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. 14-Day Money-Back Guarantee
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We offer a 14-day money-back guarantee for all new Pro plan subscriptions. If you're not satisfied with Pulse within the first 14 days of your initial subscription, we'll provide a full refund, no questions asked.
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Guarantee Details
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Applies to first-time Pro plan subscribers only</li>
                  <li>14-day period starts from your initial subscription date</li>
                  <li>Full refund of all subscription fees paid</li>
                  <li>No cancellation fees or penalties</li>
                  <li>Refund processed within 5-7 business days</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Pro Plan Refund Eligibility
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To be eligible for a Pro plan refund, you must meet the following criteria:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Request must be made within 14 days of initial subscription</li>
                <li>Account must be in good standing with no policy violations</li>
                <li>No more than 100 messages sent during the trial period</li>
                <li>No abuse of the service or violation of terms of service</li>
                <li>First-time Pro plan subscriber (no previous Pro subscriptions)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Refunds are not available for Pro plan subscriptions after the 14-day period or for renewals.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Enterprise Plan Billing Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Enterprise plans have different billing and refund terms:
              </p>
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Enterprise Terms
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Annual Commitment:</strong> Enterprise plans require annual commitments</li>
                  <li><strong>Custom Terms:</strong> Refund terms are negotiated in your enterprise agreement</li>
                  <li><strong>Pro-Rated Refunds:</strong> May be available in specific circumstances</li>
                  <li><strong>Service Credits:</strong> Often provided instead of cash refunds</li>
                  <li><strong>Early Termination:</strong> Subject to terms in your enterprise contract</li>
                </ul>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Please refer to your enterprise agreement for specific refund and cancellation terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. How to Request a Refund
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To request a refund, follow these steps:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                <li>Contact our support team at refunds@pulsechat.com</li>
                <li>Include your account email and subscription details</li>
                <li>Briefly explain your reason for the refund request</li>
                <li>Our team will review your request within 2-3 business days</li>
                <li>Approved refunds are processed within 5-7 business days</li>
              </ol>
              <div className="bg-muted/30 rounded-lg p-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Please include "Refund Request" in your email subject line for faster processing.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Non-Refundable Items
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The following items are non-refundable:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Pro plan subscriptions after the 14-day guarantee period</li>
                <li>Enterprise plan fees (subject to contract terms)</li>
                <li>Add-on services and custom integrations</li>
                <li>Professional services and training fees</li>
                <li>Third-party app marketplace purchases</li>
                <li>Usage-based charges for message storage or API calls</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Refund Processing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Once your refund is approved:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Refunds are processed to your original payment method</li>
                <li>Processing time is 5-7 business days</li>
                <li>You'll receive a confirmation email when processed</li>
                <li>Your account will be downgraded to the Free plan</li>
                <li>All Pro features will become unavailable</li>
                <li>Data retention follows Free plan policies (30 days)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If your original payment method is no longer available, we'll work with you to arrange an alternative refund method.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Cancellation Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can cancel your subscription at any time:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Pro Plan:</strong> Cancel anytime, continue using until end of billing period</li>
                <li><strong>Enterprise:</strong> Subject to contract terms and notice periods</li>
                <li><strong>No Cancellation Fees:</strong> We don't charge fees for cancelling</li>
                <li><strong>Data Export:</strong> You can export your data before cancellation</li>
                <li><strong>Reactivation:</strong> You can reactivate your subscription anytime</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Disputes and Exceptions
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In rare cases, we may consider exceptions to our standard refund policy:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Service outages lasting more than 24 hours</li>
                <li>Billing errors or duplicate charges</li>
                <li>Significant service changes not communicated in advance</li>
                <li>Technical issues preventing normal service use</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Each exception request is reviewed on a case-by-case basis. Contact our support team to discuss your specific situation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For refund requests or questions about this policy:
              </p>
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> refunds@pulsechat.com<br />
                  <strong>Support:</strong> support@pulsechat.com<br />
                  <strong>Phone:</strong> 1-800-PULSE-AI<br />
                  <strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM PST
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Policy Changes
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify this refund policy at any time. Changes will be communicated to users via email and posted on our website. Changes will not affect refund requests made before the policy change takes effect.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-muted/50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Questions About Our Refund Policy?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you understand our refund and billing policies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/contact')}>
                  Contact Support
                </Button>
                <Button variant="outline" onClick={() => navigate('/pricing')}>
                  View Pricing Plans
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refund;