'use client';

import { Transaction, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TransactionReceipt } from './TransactionReceipt';
import { DollarSign, ShoppingCart, Users, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AdminDashboardProps {
  transactions: Transaction[];
  users: User[];
  loading?: boolean;
}

// This will be passed from the parent component

export function AdminDashboard({ transactions, users, loading = false }: AdminDashboardProps) {
  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const totalTax = transactions.reduce((sum, tx) => sum + tx.serviceTax, 0);
  const disputedCount = transactions.filter(tx => tx.status === 'disputed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and monitor transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{transactions.length}</div>
            <p className="text-xs text-gray-600 mt-1">Completed purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Users</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{users.length}</div>
            <p className="text-xs text-gray-600 mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Disputed</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{disputedCount}</div>
            <p className="text-xs text-gray-600 mt-1">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="users">Users Overview</TabsTrigger>
          <TabsTrigger value="disputed">
            Disputed ({disputedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2>All Transactions</h2>
            <div className="text-sm text-gray-600">
              Total Tax Collected: <span className="text-gray-900">${totalTax.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-4">
            {transactions.map(transaction => (
              <TransactionReceipt
                key={transaction.id}
                transaction={transaction}
                onDispute={() => {}}
                showUserInfo={true}
                isAdmin={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <h2 className="mb-4">Users Overview</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => {
              const userTransactions = transactions.filter(tx => tx.userId === user.id);
              const userSpent = userTransactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
              
              return (
                <Card key={user.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{user.name}</CardTitle>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Courses Purchased:</span>
                      <span className="text-gray-900">{user.purchasedCourses.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="text-gray-900">${userSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transactions:</span>
                      <span className="text-gray-900">{userTransactions.length}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">No users found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="disputed" className="space-y-4">
          <h2 className="mb-4">Disputed Transactions</h2>
          {transactions.filter(tx => tx.status === 'disputed').length > 0 ? (
            <div className="space-y-4">
              {transactions
                .filter(tx => tx.status === 'disputed')
                .map(transaction => (
                  <TransactionReceipt
                    key={transaction.id}
                    transaction={transaction}
                    onDispute={() => {}}
                    showUserInfo={true}
                    isAdmin={true}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="mb-2">No disputed transactions</h3>
                <p className="text-gray-600">All transactions are in good standing</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

