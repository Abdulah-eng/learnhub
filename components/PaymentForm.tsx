'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle } from 'lucide-react';

export interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  address: string;
  zipCode: string;
  recipientEmail: string;
}

interface PaymentFormProps {
  courseTitle: string;
  totalAmount: number;
  defaultEmail?: string;
  onSubmit: (paymentDetails: PaymentDetails) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PaymentForm({ 
  courseTitle, 
  totalAmount, 
  defaultEmail = '',
  onSubmit, 
  onCancel,
  isLoading = false 
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentDetails>({
    cardName: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    address: '',
    zipCode: '',
    recipientEmail: defaultEmail,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentDetails, string>>>({});

  const validateCardNumber = (value: string): boolean => {
    // Remove spaces and check if it's 13-19 digits
    const cleaned = value.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  };

  const validateExpirationDate = (value: string): boolean => {
    // Format: MM/YY
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(value)) return false;
    
    const [month, year] = value.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    return expiryDate > now;
  };

  const validateCVV = (value: string): boolean => {
    return /^\d{3,4}$/.test(value);
  };

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const formatCardNumber = (value: string): string => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpirationDate = (value: string): string => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Format as MM/YY
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleChange = (field: keyof PaymentDetails, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expirationDate') {
      formattedValue = formatExpirationDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof PaymentDetails, string>> = {};

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.expirationDate.trim()) {
      newErrors.expirationDate = 'Expiration date is required';
    } else if (!validateExpirationDate(formData.expirationDate)) {
      newErrors.expirationDate = 'Please enter a valid expiration date (MM/YY)';
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!validateCVV(formData.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{5,10}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid zip code';
    }

    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = 'Email is required';
    } else if (!validateEmail(formData.recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200/50 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-900">
            Enter your payment details to complete the purchase of <strong>{courseTitle}</strong>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="cardName">Cardholder Name</Label>
          <Input
            id="cardName"
            type="text"
            value={formData.cardName}
            onChange={(e) => handleChange('cardName', e.target.value)}
            placeholder="John Doe"
            className={errors.cardName ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.cardName && (
            <p className="text-sm text-red-500 mt-1">{errors.cardName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleChange('cardNumber', e.target.value)}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={errors.cardNumber ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.cardNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input
              id="expirationDate"
              type="text"
              value={formData.expirationDate}
              onChange={(e) => handleChange('expirationDate', e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              className={errors.expirationDate ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.expirationDate && (
              <p className="text-sm text-red-500 mt-1">{errors.expirationDate}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              type="text"
              value={formData.cvv}
              onChange={(e) => handleChange('cvv', e.target.value)}
              placeholder="123"
              maxLength={4}
              className={errors.cvv ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.cvv && (
              <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="address">Billing Address</Label>
          <Input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Main Street, City, State"
            className={errors.address ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            type="text"
            value={formData.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            placeholder="12345"
            maxLength={10}
            className={errors.zipCode ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.zipCode && (
            <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>
          )}
        </div>

        <div>
          <Label htmlFor="recipientEmail">Email for Zoom Link</Label>
          <Input
            id="recipientEmail"
            type="email"
            value={formData.recipientEmail}
            onChange={(e) => handleChange('recipientEmail', e.target.value)}
            placeholder="student@example.com"
            className={errors.recipientEmail ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the email address where you want to receive the Zoom link for this course
          </p>
          {errors.recipientEmail && (
            <p className="text-sm text-red-500 mt-1">{errors.recipientEmail}</p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-medium">Total Amount:</span>
          <span className="text-gray-900 text-xl font-semibold">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Complete Purchase'}
        </Button>
      </div>
    </form>
  );
}

