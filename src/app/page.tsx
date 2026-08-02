import PublicLayout from "@/components/PublicLayout";
import Link from "next/link";

const features = [
  {
    icon: "🔍",
    title: "Medicine Search",
    desc: "Check real-time availability and stock status",
    href: "/search",
  },
  {
    icon: "📋",
    title: "Upload Prescription",
    desc: "Upload PDF or photo for quick fulfillment",
    href: "/prescription",
  },
  {
    icon: "🩺",
    title: "Book Appointment",
    desc: "Schedule in-house doctor consultation",
    href: "/appointment",
  },
  {
    icon: "🚚",
    title: "Home Delivery",
    desc: "Get medicines delivered to your doorstep",
    href: "/delivery",
  },
  {
    icon: "💬",
    title: "WhatsApp Order",
    desc: "Send prescription directly on WhatsApp",
    href: "https://wa.me/918336027489?text=Hi%2C%20I%20need%20medicines%20from%20Sharma%20Pharmacy.",
    external: true,
  },
  {
    icon: "📍",
    title: "Visit Us",
    desc: "Liluah, Howrah, West Bengal 711203",
    href: "/contact",
  },
];

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-6 font-medium">
              <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
              Trusted Neighbourhood Pharmacy
            </div>
            
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-900 leading-tight mb-4 sm:mb-6">
              Your Health,{" "}
              <span className="text-primary-600">Our Priority</span>
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
              Sharma Pharmacy offers quality medicines, in-house doctor consultations, prescription services, and home delivery — all under one roof in Howrah, Kolkata.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/search"
                className="bg-primary-600 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-lg shadow-primary-200 text-center"
              >
                🔍 Search Medicines
              </Link>
              <Link
                href="/appointment"
                className="bg-white text-primary-700 px-6 py-3.5 rounded-xl font-medium border-2 border-primary-200 hover:border-primary-400 active:bg-primary-50 transition-colors text-center"
              >
                🩺 Book Appointment
              </Link>
              <a
                href="tel:+918336027489"
                className="bg-accent-500 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-accent-600 active:bg-accent-700 transition-colors flex items-center justify-center gap-2"
              >
                📞 Call Now
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary-100/40 to-transparent hidden lg:block" />
      </section>

      {/* Services Grid */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-2 sm:mb-3">
              Our Services
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Everything you need for your health, available in-store and online.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {features.map((f) => {
              const inner = (
                <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg hover:border-primary-200 active:bg-slate-50 transition-all duration-300 group h-full">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-4">{f.icon}</div>
                  <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {f.desc}
                  </p>
                </div>
              );
              if ("external" in f && f.external) {
                return (
                  <a key={f.title} href={f.href} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                );
              }
              return (
                <Link key={f.title} href={f.href}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust / Stats Section */}
      <section className="py-10 sm:py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">15+</div>
              <div className="text-slate-600 font-medium text-xs sm:text-base">Years of Service</div>
              <p className="text-[10px] sm:text-sm text-slate-400 mt-1 hidden sm:block">Serving since 2009</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">5000+</div>
              <div className="text-slate-600 font-medium text-xs sm:text-base">Medicines</div>
              <p className="text-[10px] sm:text-sm text-slate-400 mt-1 hidden sm:block">Branded & generic</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">🩺</div>
              <div className="text-slate-600 font-medium text-xs sm:text-base">Doctor On-Site</div>
              <p className="text-[10px] sm:text-sm text-slate-400 mt-1 hidden sm:block">Mon–Sat</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Need Medicines Urgently?</h3>
                <p className="text-primary-100 text-sm sm:text-base">
                  Call us or send a WhatsApp message for immediate assistance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <a
                  href="tel:+918336027489"
                  className="bg-white text-primary-700 px-6 py-3 rounded-xl font-medium hover:bg-primary-50 active:bg-primary-100 transition-colors text-center"
                >
                  📞 +91 8336027489
                </a>
                <a
                  href="https://wa.me/918336027489?text=Hi%2C%20I%20need%20urgent%20medicines."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-accent-600 active:bg-accent-700 transition-colors text-center"
                >
                  💬 WhatsApp Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 sm:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-primary-900 mb-2">Find Us</h2>
            <p className="text-slate-500 text-sm sm:text-base">88, Mirpara Rd, Bhatta Nagar, Liluah, Howrah, WB 711203</p>
          </div>
          <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
            <iframe
              title="Sharma Pharmacy Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.5!2d88.3271886!3d22.6200282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM3JzEyLjEiTiA4OMKwMTknMzcuOSJF!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="250"
              className="sm:h-[350px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="text-center mt-4 sm:mt-6">
            <a
              href="https://www.google.com/maps/place/Sharma+Pharmacy/@22.6200282,88.3271886"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors"
            >
              📍 Get Directions on Google Maps
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
