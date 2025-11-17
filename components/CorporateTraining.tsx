'use client';

import { Building2, Users, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

export function CorporateTraining() {
  const trainingPackages = [
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
          {trainingPackages.map((pkg, index) => (
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
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Duration:</span> {pkg.duration}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
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
    </section>
  );
}

