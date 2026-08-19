import { FormEvent, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Facebook, Instagram, Twitter } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Get in Touch</h1>
        <p className="text-gray-500">We would love to hear from you. Reach out anytime.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Phone, title: 'Call Us', value: '+44 20 1234 5678' },
              { icon: Mail, title: 'Email', value: 'hello@singhsshop.com' },
              { icon: MapPin, title: 'Visit Us', value: '123 Food Street, London, UK' },
              { icon: Clock, title: 'Open Hours', value: '10am - 11pm, Daily' },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{c.title}</h3>
                  <p className="text-sm text-gray-600">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <iframe
                title="Shop location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.13%2C51.5%2C-0.1%2C51.52&layer=mapnik"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-600 hover:text-white text-gray-700 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Send us a message</h2>
          {sent && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              Thank you! Your message has been sent. We will get back to you soon.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition" />
              <input required type="email" placeholder="Your email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition" />
            </div>
            <input required placeholder="Subject" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition" />
            <textarea required rows={5} placeholder="Your message" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition resize-none" />
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-colors">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
