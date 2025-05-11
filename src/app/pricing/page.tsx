import { prisma } from '@/lib/prisma';
import { SubscriptionPlan } from '@prisma/client';
import SubscriptionPlansClient from "@/components/subscriptions/SubscriptionPlans";
import ScrollToPlansButton from '@/components/pricing/ScrollToPlansButton';

async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    // Fetch active plans, ordered by price (can be adjusted)
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    return plans;
  } catch (error) {
    console.error("Failed to fetch subscription plans for pricing page:", error);
    return []; // Return empty array on error
  }
}

export default async function PricingPage() {
  const plans = await fetchSubscriptionPlans(); // Fetch data here on the server

  return (
    <div className="bg-gradient-to-b from-white to-gray-100">
      {/* Hero section */}
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bebasNeue mb-6 tracking-wider uppercase">
            <span className="text-neon-yellow">Pricing</span> Plans for <span className="text-blood-red">Champions</span>
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Select the perfect plan for your fitness journey. Access premium facilities and crush your goals with FitNass.
          </p>
        </div>

        {/* Plans display */}
        <div id="pricing-plans">
          <SubscriptionPlansClient plans={plans} />
        </div>
      </div>

      {/* Features section */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bebasNeue text-center mb-12 tracking-wider uppercase text-gray-800">
            Why Choose <span className="text-neon-yellow">FitNass</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Unlimited Access",
                description: "Get access to all premium features and facilities with our top-tier plans.",
                icon: "🏋️"
              },
              {
                title: "No Contracts",
                description: "Flexible subscription options with no long-term commitments required.",
                icon: "📝"
              },
              {
                title: "Premium Support",
                description: "24/7 customer support to assist you with any questions or issues.",
                icon: "🛟"
              },
              {
                title: "Exclusive Content",
                description: "Access to exclusive workout programs and training materials.",
                icon: "🔑"
              },
              {
                title: "Community Access",
                description: "Join a community of like-minded fitness enthusiasts.",
                icon: "👥"
              },
              {
                title: "Money-Back Guarantee",
                description: "Not satisfied? Get your money back within the first 14 days.",
                icon: "💰"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-neon-yellow transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto py-20 px-4 bg-white">
        <h2 className="text-3xl md:text-4xl font-bebasNeue text-center mb-12 tracking-wider uppercase text-gray-800">
          Frequently <span className="text-neon-yellow">Asked</span> Questions
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: "How do I cancel my subscription?",
              answer: "You can cancel your subscription anytime from your account dashboard. Your access will continue until the end of your billing period."
            },
            {
              question: "Are there any hidden fees?",
              answer: "No, the price you see is what you pay. There are no hidden fees or additional charges."
            },
            {
              question: "Can I upgrade my plan later?",
              answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle."
            },
            {
              question: "Do you offer discounts for annual subscriptions?",
              answer: "Yes, annual subscriptions come with a significant discount compared to monthly billing."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-100 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bebasNeue mb-6 tracking-wider uppercase text-gray-800">
            Ready to <span className="text-blood-red">Dominate</span> Your Fitness?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of satisfied members already crushing their fitness goals with FitNass.
          </p>
          <ScrollToPlansButton>Choose Your Plan</ScrollToPlansButton>
        </div>
      </div>
    </div>
  );
} 