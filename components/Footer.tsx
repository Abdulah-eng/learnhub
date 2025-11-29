'use client';

import { useState } from 'react';
import { BookOpen, Mail, HelpCircle, FileText, Shield, Users, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

export function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showInstructorsModal, setShowInstructorsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showFAQsModal, setShowFAQsModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Thank you for contacting us! We will get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
    setShowContactModal(false);
    setIsSubmitting(false);
  };

  return (
    <>
      <footer className="bg-gray-900 text-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-semibold text-white">LearnHub</span>
              </div>
              <p className="text-sm mb-4">
                Empowering learners worldwide with expert-led courses and cutting-edge technology education.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => setShowAboutModal(true)} className="hover:text-blue-400 transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowInstructorsModal(true)} className="hover:text-blue-400 transition-colors">
                    Instructors
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowFAQsModal(true)} className="hover:text-blue-400 transition-colors">
                    FAQs
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowSupportModal(true)} className="hover:text-blue-400 transition-colors">
                    Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => setShowTermsModal(true)} className="hover:text-blue-400 transition-colors">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowPrivacyModal(true)} className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>info@infraninja.org</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* About Us Modal */}
      <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About Us
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-700">
            <p>
              LearnHub is a leading online learning platform dedicated to providing high-quality, 
              expert-led courses in cutting-edge technologies. Our mission is to empower learners 
              worldwide by making professional education accessible, engaging, and effective.
            </p>
            <div>
              <h3 className="font-semibold mb-2">Our Mission</h3>
              <p>
                To democratize education and provide learners with the skills they need to succeed 
                in today's rapidly evolving technological landscape.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Our Vision</h3>
              <p>
                To become the world's most trusted platform for technology education, where learners 
                can discover, learn, and grow without limits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What We Offer</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Comprehensive courses in Generative AI, DevOps, Cloud Computing, and more</li>
                <li>Expert instructors with real-world industry experience</li>
                <li>Hands-on projects and practical exercises</li>
                <li>Certificates of completion</li>
                <li>Lifetime access to course materials</li>
                <li>Live sessions and Q&A with instructors</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instructors Modal */}
      <Dialog open={showInstructorsModal} onOpenChange={setShowInstructorsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Our Instructors
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-700">
            <p>
              Our instructors are industry experts, researchers, and practitioners with years of 
              experience in their respective fields. They bring real-world knowledge and practical 
              insights to every course.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Dr. Sarah Mitchell</h3>
                <p className="text-sm text-gray-600 mb-2">GenAI Expert</p>
                <p className="text-sm">
                  PhD in Computer Science, 10+ years in AI research, published author
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Alex Chen</h3>
                <p className="text-sm text-gray-600 mb-2">Prompt Engineering Specialist</p>
                <p className="text-sm">
                  Senior AI Engineer at leading tech companies, LLM expert
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Dr. Maria Rodriguez</h3>
                <p className="text-sm text-gray-600 mb-2">Multimodal AI Researcher</p>
                <p className="text-sm">
                  Research scientist with expertise in vision-language models
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Mark Stevens</h3>
                <p className="text-sm text-gray-600 mb-2">Cloud & DevOps Architect</p>
                <p className="text-sm">
                  AWS Solutions Architect, Kubernetes expert, 15+ years experience
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              All our instructors are carefully vetted to ensure they meet our high standards 
              for expertise, teaching ability, and industry relevance.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Modal */}
      <Dialog open={showSupportModal} onOpenChange={setShowSupportModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support
            </DialogTitle>
            <DialogDescription>
              We're here to help! Get in touch with our support team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">Support Channels</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email: info@infraninja.org</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Common Support Topics</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Course access and enrollment issues</li>
                <li>Payment and billing questions</li>
                <li>Technical difficulties</li>
                <li>Certificate requests</li>
                <li>Refund requests</li>
                <li>Account management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-sm">
                We aim to respond to all support inquiries within 24 hours during business days. 
                For urgent matters, please call our support line.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Terms of Service
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-700 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing and using LearnHub, you accept and agree to be bound by these Terms of Service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Use of Service</h3>
              <p>
                You agree to use LearnHub only for lawful purposes and in accordance with these Terms. 
                You may not share your account credentials or course materials with others.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Course Access</h3>
              <p>
                Upon purchase, you will receive lifetime access to the course materials. Access is 
                personal and non-transferable.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Payment and Refunds</h3>
              <p>
                All payments are processed securely. Refunds are available within 30 days of purchase 
                if you are not satisfied with the course.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5. Intellectual Property</h3>
              <p>
                All course content, materials, and resources are protected by copyright. You may not 
                reproduce, distribute, or create derivative works without permission.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">6. Limitation of Liability</h3>
              <p>
                LearnHub is not liable for any indirect, incidental, or consequential damages arising 
                from your use of the service.
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Policy
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-700 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. Information We Collect</h3>
              <p>
                We collect information you provide directly, including name, email, payment information, 
                and course progress data.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>To provide and improve our services</li>
                <li>To process payments and transactions</li>
                <li>To send course updates and communications</li>
                <li>To analyze usage and improve user experience</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Data Security</h3>
              <p>
                We implement industry-standard security measures to protect your personal information. 
                All payment data is encrypted and processed securely.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Third-Party Services</h3>
              <p>
                We may use third-party services for payment processing, analytics, and email delivery. 
                These services have their own privacy policies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5. Your Rights</h3>
              <p>
                You have the right to access, update, or delete your personal information. You can 
                also opt-out of marketing communications at any time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">6. Cookies</h3>
              <p>
                We use cookies to enhance your experience, analyze usage, and personalize content. 
                You can manage cookie preferences in your browser settings.
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAQs Modal */}
      <Dialog open={showFAQsModal} onOpenChange={setShowFAQsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </DialogTitle>
          </DialogHeader>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I enroll in a course?</AccordionTrigger>
              <AccordionContent>
                Simply browse our courses, click on a course you're interested in, and click 
                "Purchase Now". Complete the payment process, and you'll have immediate access 
                to the course materials.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Do I get a certificate after completing a course?</AccordionTrigger>
              <AccordionContent>
                Yes! Upon successful completion of a course, you'll receive a certificate of 
                completion that you can download and share on your professional profiles.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I get a refund if I'm not satisfied?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your 
                course purchase, contact our support team for a full refund.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How long do I have access to the course?</AccordionTrigger>
              <AccordionContent>
                You have lifetime access to all course materials once you purchase a course. 
                You can learn at your own pace and revisit the content anytime.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Are the courses suitable for beginners?</AccordionTrigger>
              <AccordionContent>
                Yes! We offer courses at all levels - Beginner, Intermediate, and Advanced. 
                Each course clearly indicates its difficulty level, and many advanced courses 
                include prerequisite information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>How do I access live sessions?</AccordionTrigger>
              <AccordionContent>
                After purchasing a course, you'll receive a Zoom link via email. Live sessions 
                are scheduled and announced in the course materials. You can also find session 
                recordings in your course dashboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards, debit cards, and PayPal. All payments are 
                processed securely through our payment partners.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>Can I share my course with others?</AccordionTrigger>
              <AccordionContent>
                No, course access is personal and non-transferable. Sharing account credentials 
                or course materials violates our Terms of Service. Each learner needs their own 
                account and purchase.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogContent>
      </Dialog>

      {/* Contact Form Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              Send us a message and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                rows={5}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowContactModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

