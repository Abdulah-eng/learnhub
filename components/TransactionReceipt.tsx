'use client';

import { useState } from 'react';
import { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Receipt, AlertTriangle, User, Printer } from 'lucide-react';

interface TransactionReceiptProps {
  transaction: Transaction;
  onDispute: (transactionId: string, reason: string) => void;
  showUserInfo: boolean;
  isAdmin?: boolean;
}

export function TransactionReceipt({ transaction, onDispute, showUserInfo, isAdmin = false }: TransactionReceiptProps) {
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const date = new Date(transaction.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDispute = () => {
    if (disputeReason.trim()) {
      onDispute(transaction.id, disputeReason);
      setShowDisputeDialog(false);
      setDisputeReason('');
    }
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Transaction Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background: white;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              color: #000;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .section {
              margin-bottom: 25px;
            }
            .section h2 {
              font-size: 18px;
              margin-bottom: 15px;
              color: #000;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .row.total {
              font-weight: bold;
              font-size: 16px;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              padding: 10px 0;
              margin-top: 10px;
            }
            .label {
              color: #666;
            }
            .value {
              color: #000;
              font-weight: 500;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LearnHub</h1>
            <p>Transaction Receipt</p>
          </div>
          
          <div class="section">
            <h2>Transaction Details</h2>
            <div class="row">
              <span class="label">Transaction ID:</span>
              <span class="value">${transaction.id}</span>
            </div>
            <div class="row">
              <span class="label">Date:</span>
              <span class="value">${formattedDate}</span>
            </div>
            <div class="row">
              <span class="label">Status:</span>
              <span class="value">${transaction.status === 'disputed' ? 'Disputed' : 'Completed'}</span>
            </div>
            ${showUserInfo ? `
            <div class="row">
              <span class="label">User:</span>
              <span class="value">${transaction.userName}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="section">
            <h2>Course Information</h2>
            <div class="row">
              <span class="label">Course Title:</span>
              <span class="value">${transaction.courseTitle}</span>
            </div>
          </div>
          
          <div class="section">
            <h2>Payment Details</h2>
            <div class="row">
              <span class="label">Course Price:</span>
              <span class="value">$${transaction.coursePrice.toFixed(2)}</span>
            </div>
            <div class="row">
              <span class="label">Service Tax (8%):</span>
              <span class="value">$${transaction.serviceTax.toFixed(2)}</span>
            </div>
            <div class="row total">
              <span class="label">Total Amount:</span>
              <span class="value">$${transaction.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          ${transaction.status === 'disputed' && transaction.disputeReason ? `
          <div class="section">
            <h2>Dispute Information</h2>
            <div class="row">
              <span class="label">Dispute Reason:</span>
              <span class="value">${transaction.disputeReason}</span>
            </div>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>This is an official receipt from LearnHub</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

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
              <span className="text-gray-600">Service Tax (8%):</span>
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

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrintReceipt}
              className="flex-1"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            {!isAdmin && transaction.status !== 'disputed' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDisputeDialog(true)}
                className="flex-1"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Dispute Transaction
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent className="bg-white">
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

