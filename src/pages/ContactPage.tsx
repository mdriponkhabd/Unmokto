import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetaManager } from '../components/seo/MetaManager';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-12">
      <MetaManager
        title={`Contact Us – ${settings.siteName || 'Unmokto'}`}
        description="Have a question, feedback, or tool suggestion? Contact the Unmokto team."
        canonicalPath="/contact"
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Get in Touch
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Have a question, feedback, or a suggestion for a new free tool? We would love to hear from you.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          {submitted ? (
            <div className="text-center py-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 mb-3">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Message Sent Successfully!
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Thank you for reaching out. We will get back to you at {formData.email} as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Tool feature request / feedback"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Your Message
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-sm hover:bg-emerald-500 cursor-pointer w-full sm:w-auto"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>

              <p className="text-xs text-slate-400 mt-2">
                You can also email us directly at: <a href={`mailto:${settings.contactEmail || 'contact@unmokto.com'}`} className="text-emerald-600 underline">{settings.contactEmail || 'contact@unmokto.com'}</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
