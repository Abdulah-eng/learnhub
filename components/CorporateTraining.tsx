'use client';

import { useState } from 'react';
import { Building2, Users, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { PaymentForm, PaymentDetails } from './PaymentForm';
import { useApp } from '@/lib/context/AppContext';

interface CorporateTrainingPackage {
  duration: string;
  price: number;
  description: string;
}

export function CorporateTraining() {
  const { currentUser, setShowAuthModal } = useApp();
  const [selectedPackage, setSelectedPackage] = useState<CorporateTrainingPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const trainingPackages: CorporateTrainingPackage[] = [
    {
      duration: '15 Days',
      price: 14999,
      description: 'Intensive 15-day corporate training program'
    },
    {
      duration: '45 Days',
      price: 25000,
      description: 'Comprehensive 45-day corporate training program'
    },
    {
      duration: '3 Months',
      price: 50000,
      description: 'Extended 3-month corporate training program'
    }
  ];

  const handlePurchaseClick = (pkg: CorporateTrainingPackage) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setSelectedPackage(pkg);
  };

  const handlePaymentSubmit = async (paymentDetails: PaymentDetails) => {
    if (!selectedPackage || !currentUser) return;

    setIsLoading(true);
    try {
      const serviceTax = selectedPackage.price * 0.08;
      const totalAmount = selectedPackage.price + serviceTax;

      // Create transaction for corporate training
      const response = await fetch('/api/create-corporate-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          packageDuration: selectedPackage.duration,
          packagePrice: selectedPackage.price,
          serviceTax,
          totalAmount,
          paymentDetails,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      const result = await response.json();

      // Send confirmation email with Zoom link
      try {
        const zoomLink = process.env.NEXT_PUBLIC_ZOOM_LINK || `https://zoom.us/j/corporate-${selectedPackage.duration.replace(/\s/g, '-')}`;
        
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'corporate_training_purchase',
            to: paymentDetails.recipientEmail,
            data: {
              userName: paymentDetails.cardName,
              packageDuration: selectedPackage.duration,
              packagePrice: selectedPackage.price,
              totalAmount: totalAmount,
              transactionId: result.transactionId,
              zoomLink: zoomLink,
            },
          }),
        });
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }

      alert(`Successfully purchased Corporate Training (${selectedPackage.duration})! A confirmation email with your Zoom link has been sent to ${paymentDetails.recipientEmail}.`);
      setSelectedPackage(null);
    } catch (error) {
      console.error('Error purchasing corporate training:', error);
      alert('Failed to purchase corporate training. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Corporate Training</h2>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We provide comprehensive corporate training solutions for companies worldwide. 
            Our specialized instructors deliver one-on-one training tailored to your organization's needs.
          </p>
        </div>

        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            What We Offer
          </h3>
          <p className="text-gray-700 mb-4">
            We do have corporate training for corporate companies. Our programs are designed to enhance your team's skills 
            and drive organizational growth through expert-led, personalized training sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {trainingPackages.map((pkg, index) => {
            const serviceTax = pkg.price * 0.08;
            const totalAmount = pkg.price + serviceTax;
            
            return (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="text-sm">
                      {pkg.duration}
                    </Badge>
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    ${pkg.price.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <div className="pt-4 border-t border-gray-200 space-y-2 mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Duration:</span> {pkg.duration}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Tax (8%):</span>
                      <span className="text-gray-900">${serviceTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handlePurchaseClick(pkg)} 
                    className="w-full"
                    size="lg"
                  >
                    Purchase Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Training Delivery</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>One-on-One Training:</strong> All corporate trainings are conducted one-on-one by our specialized instructors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>On-Site Training:</strong> We provide corporate trainings on-site in any city in the world</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Customized Programs:</strong> Training programs tailored to your company's specific needs and goals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Training Purchase Dialog */}
      {selectedPackage && (
        <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
          <DialogContent className="bg-white p-4 sm:p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Corporate Training Purchase</DialogTitle>
              <DialogDescription>
                Enter your payment information to complete the purchase
              </DialogDescription>
            </DialogHeader>

            <div className="mb-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Package Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900 font-medium">{selectedPackage.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Package Price:</span>
                  <span className="text-gray-900">${selectedPackage.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Tax (8%):</span>
                  <span className="text-gray-900">${(selectedPackage.price * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-gray-900">${(selectedPackage.price * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <PaymentForm
              courseTitle={`Corporate Training - ${selectedPackage.duration}`}
              totalAmount={selectedPackage.price * 1.08}
              defaultEmail={currentUser?.email || ''}
              onSubmit={handlePaymentSubmit}
              onCancel={() => setSelectedPackage(null)}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

