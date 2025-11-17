'use client';

import { Star, Globe } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function Testimonials() {
  const usClients = ['Verizon', 'Citi', 'Nestle'];
  const countries = ['UK', 'India', 'China', 'Dubai'];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Happy Clients</h2>
          <p className="text-lg text-gray-700">
            Trusted by leading companies and organizations worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* US Clients */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-semibold">United States</h3>
              </div>
              <div className="space-y-4">
                {usClients.map((client, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">{client}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* International Clients */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-5 w-5 text-green-600" />
                <h3 className="text-xl font-semibold">International</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {countries.map((country, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">{country}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-700 font-medium">
              Trusted by companies across the globe
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

