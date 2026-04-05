'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: 'Address',
    details: ['Sector 3, Near vinayak Toll Tax', 'Saver Road Indore, MP 452001'],
  },
{
  icon: <Phone className="w-5 h-5" />,
  title: 'Phone',
  details: [
    <a href="tel:+919977022085" className="hover:underline">
      +91 9977022085
    </a>
  ],
},
  {
    icon: <Mail className="w-5 h-5" />,
    title: 'Email',
    details: ['sanjay.panchal3006@gmail.com'],
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Business Hours',
    details: ['Mon-Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 2:00 PM'],
  },
];

export default function ContactSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    if (!name.trim()) return 'Name is required';
    if (!phone.trim()) return 'Phone number is required';
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    if (!message.trim()) return 'Message is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success('Message sent successfully!', {
          description: 'We will get back to you within 24 hours.',
        });
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30" id="contact">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about our products or need a custom solution? We&apos;d
            love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-transparent bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 pt-8">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Send Us a Message
                </h3>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center gap-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      >
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                      </motion.div>
                      <h4 className="text-xl font-semibold text-foreground">
                        Message Sent!
                      </h4>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We&apos;ll respond within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Full Name</Label>
                        <Input
                          id="contact-name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">Phone</Label>
                          <Input
                            id="contact-phone"
                            placeholder="+91"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Email</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-message">Message</Label>
                        <Textarea
                          id="contact-message"
                          placeholder="Tell us about your packaging needs..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={5}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border-transparent bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h4>
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
