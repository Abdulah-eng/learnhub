'use client';

import { useState } from 'react';
import { Course } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface CourseDetailProps {
  course: Course;
  onClose: () => void;
  onPurchase: () => void;
  isPurchased: boolean;
}

export function CourseDetail({ course, onClose, onPurchase, isPurchased }: CourseDetailProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const serviceTax = course.price * 0.08;
  const totalAmount = course.price + serviceTax;

  const handlePurchaseClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmPurchase = () => {
    setShowConfirmDialog(false);
    onPurchase();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="sr-only">{course.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            {isPurchased && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>You own this course</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{course.level}</Badge>
              <Badge variant="outline">{course.category}</Badge>
            </div>
            
            <h2 className="mb-3">{course.title}</h2>
            
            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
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

          {!isPurchased && (
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
            </div>
          )}

          <div className="border-t border-gray-200/50 pt-6 flex items-center justify-between">
            {!isPurchased && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Price</p>
                <p className="text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            )}
            
            <div className="flex gap-3 ml-auto">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {!isPurchased && (
                <Button onClick={handlePurchaseClick} size="lg">
                  Purchase Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              Are you sure you want to purchase this course? This action will complete the transaction.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
                <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
              </div>
              
              <div className="border-t border-gray-200/50 pt-3 space-y-2">
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
                    <span className="font-medium text-gray-900">Total Amount:</span>
                    <span className="font-medium text-gray-900">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  After confirmation, the course will be added to your account and a transaction receipt will be generated.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPurchase} size="lg">
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

