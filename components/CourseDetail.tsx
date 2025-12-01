'use client';

import { useState } from 'react';
import { Course } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Users, Clock, CheckCircle2 } from 'lucide-react';
import { PaymentForm, PaymentDetails } from './PaymentForm';

interface CourseDetailProps {
  course: Course;
  onClose: () => void;
  onPurchase: (paymentDetails: PaymentDetails) => Promise<void>;
  isPurchased: boolean;
  userEmail?: string;
}

export function CourseDetail({ course, onClose, onPurchase, isPurchased, userEmail = '' }: CourseDetailProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const serviceTax = course.price * 0.08;
  const totalAmount = course.price + serviceTax;

  const handlePurchaseClick = () => {
    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = async (paymentDetails: PaymentDetails) => {
    try {
      await onPurchase(paymentDetails);
      setShowPaymentDialog(false);
      // Close the course detail dialog after successful purchase
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error('Purchase error:', error);
      // Keep dialog open on error so user can retry
    } finally {
      // no-op; we don't hold any loading state here so the UI stays responsive
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-8">
        <DialogHeader>
          <DialogTitle className="sr-only">{course.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 sm:h-64 object-cover"
            />
            {isPurchased && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>You own this course</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary">{course.level}</Badge>
              <Badge variant="outline">{course.category}</Badge>
            </div>
            
            <h2 className="mb-3">{course.title}</h2>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating} rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              Instructor: <span className="text-gray-900">{course.instructor}</span>
            </p>
          </div>

          <div>
            <h3 className="mb-3">Course Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div>
            <h3 className="mb-3">What You'll Learn</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Master the fundamentals and advanced concepts</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Build real-world projects from scratch</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Get hands-on experience with industry tools</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Receive a certificate of completion</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="mb-3">Price Breakdown</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Course Price:</span>
              <span className="text-gray-900">${course.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Tax (8%):</span>
              <span className="text-gray-900">${serviceTax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200/50 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-gray-900">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            {isPurchased && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-green-600">
                  ✓ You already own this course. You can purchase it again to create a new transaction.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200/50 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Price</p>
              <p className="text-gray-900 text-xl">${totalAmount.toFixed(2)}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 ml-auto w-full sm:w-auto">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Close
              </Button>
              <Button
                onClick={handlePurchaseClick}
                size="lg"
                className="w-full sm:w-auto"
              >
                {isPurchased ? 'Purchase Again' : 'Enroll Now'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Payment Form Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-white p-4 sm:p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Enter your payment information to complete the enrollment
            </DialogDescription>
          </DialogHeader>

          <PaymentForm
            courseTitle={course.title}
            totalAmount={totalAmount}
            defaultEmail={userEmail}
            onSubmit={handlePaymentSubmit}
            onCancel={() => setShowPaymentDialog(false)}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

