'use client';

import { useState } from 'react';
import { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Receipt, AlertTriangle, User } from 'lucide-react';

interface TransactionReceiptProps {
  transaction: Transaction;
  onDispute: (transactionId: string, reason: string) => void;
  showUserInfo: boolean;
  isAdmin?: boolean;
}

export function TransactionReceipt({ transaction, onDispute, showUserInfo, isAdmin = false }: TransactionReceiptProps) {
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const handleDispute = () => {
    if (disputeReason.trim()) {
      onDispute(transaction.id, disputeReason);
      setShowDisputeDialog(false);
      setDisputeReason('');
    }
  };

  const date = new Date(transaction.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      <Card className={transaction.status === 'disputed' ? 'border-red-300 bg-red-50' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">{transaction.courseTitle}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Transaction ID: {transaction.id}</p>
                {showUserInfo && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                    <User className="h-3 w-3" />
                    <span>{transaction.userName}</span>
                  </div>
                )}
              </div>
            </div>
            <Badge variant={transaction.status === 'disputed' ? 'destructive' : 'default'}>
              {transaction.status === 'disputed' ? 'Disputed' : 'Completed'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            {formattedDate}
          </div>

          <div className="bg-white rounded-lg p-4 space-y-2 border border-gray-200/50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Course Price:</span>
              <span className="text-gray-900">${transaction.coursePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Tax (18%):</span>
              <span className="text-gray-900">${transaction.serviceTax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200/50 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-gray-900">${transaction.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {transaction.status === 'disputed' && transaction.disputeReason && (
            <div className="bg-red-50 border border-red-200/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-red-900">Dispute Reason:</p>
                  <p className="text-sm text-red-700 mt-1">{transaction.disputeReason}</p>
                </div>
              </div>
            </div>
          )}

          {!isAdmin && transaction.status !== 'disputed' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDisputeDialog(true)}
              className="w-full"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Dispute Transaction
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispute Transaction</DialogTitle>
            <DialogDescription>
              Please provide a reason for disputing this transaction. Our team will review your request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dispute-reason">Reason for Dispute</Label>
              <Textarea
                id="dispute-reason"
                placeholder="Please explain why you're disputing this transaction..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <p>Transaction: {transaction.id}</p>
              <p>Course: {transaction.courseTitle}</p>
              <p>Amount: ${transaction.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisputeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDispute} disabled={!disputeReason.trim()}>
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

