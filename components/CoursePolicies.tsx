'use client';

import { AlertCircle, XCircle, DollarSign } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function CoursePolicies() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Course Policies</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-semibold">Non-Refundable</h3>
              </div>
              <p className="text-gray-700">
                All courses are non-refundable. Please review course details carefully before making a purchase.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-semibold">Non-Transferable</h3>
              </div>
              <p className="text-gray-700">
                All courses are non-transferable. Course access is tied to the purchasing account and cannot be transferred to another user.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold">Pricing</h3>
              </div>
              <p className="text-gray-700">
                Courses start from $1,499 + 8% service charge. All prices are clearly displayed before purchase.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">Important Notice</p>
              <p className="text-sm text-blue-800">
                By purchasing a course, you agree to our course policies. All sales are final and courses cannot be refunded or transferred to another account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

