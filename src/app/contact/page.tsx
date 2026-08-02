import PublicLayout from "@/components/PublicLayout";

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-2 sm:mb-3">
            Contact Us
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            We&apos;re here to help with all your healthcare needs.
          </p>
        </div>

        {/* Quick Actions - Mobile First */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:hidden">
          <a
            href="tel:+918336027489"
            className="bg-primary-600 text-white p-4 rounded-xl text-center active:bg-primary-700"
          >
            <div className="text-2xl mb-1">📞</div>
            <div className="text-sm font-medium">Call Now</div>
          </a>
          <a
            href="https://wa.me/918336027489"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent-500 text-white p-4 rounded-xl text-center active:bg-accent-600"
          >
            <div className="text-2xl mb-1">💬</div>
            <div className="text-sm font-medium">WhatsApp</div>
          </a>
          <a
            href="https://www.google.com/maps/place/Sharma+Pharmacy/@22.6200282,88.3271886"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-100 text-slate-700 p-4 rounded-xl text-center active:bg-slate-200"
          >
            <div className="text-2xl mb-1">📍</div>
            <div className="text-sm font-medium">Directions</div>
          </a>
          <a
            href="mailto:somnathsharma2012@gmail.com"
            className="bg-slate-100 text-slate-700 p-4 rounded-xl text-center active:bg-slate-200"
          >
            <div className="text-2xl mb-1">✉️</div>
            <div className="text-sm font-medium">Email</div>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-primary-50 rounded-xl p-5 sm:p-6">
              <h3 className="font-semibold text-primary-900 text-lg mb-4">Sharma Pharmacy</h3>
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                    📍
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 text-sm sm:text-base">Address</p>
                    <p className="text-slate-500 text-sm">
                      88, Mirpara Rd, Bhatta Nagar, Liluah, Howrah, West Bengal 711203
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                    📞
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 text-sm sm:text-base">Phone</p>
                    <a href="tel:+918336027489" className="text-primary-600 hover:underline text-sm sm:text-base">
                      +91 8336027489
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                    💬
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 text-sm sm:text-base">WhatsApp</p>
                    <a
                      href="https://wa.me/918336027489"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 hover:underline text-sm sm:text-base"
                    >
                      +91 8336027489
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                    ✉️
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 text-sm sm:text-base">Email</p>
                    <a
                      href="mailto:somnathsharma2012@gmail.com"
                      className="text-primary-600 hover:underline text-sm break-all"
                    >
                      somnathsharma2012@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white border border-slate-100 rounded-xl p-5 sm:p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span>🕐</span> Business Hours
              </h3>
              <div className="space-y-2.5">
                {[
                  ["Monday – Saturday", "8:00 AM – 10:00 PM"],
                  ["Sunday", "9:00 AM – 2:00 PM"],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-slate-600">{day}</span>
                    <span className="font-medium text-slate-800">{hours}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4 pt-3 border-t">
                Hours may vary on holidays. Call ahead to confirm.
              </p>
            </div>

            {/* Quick Actions - Desktop */}
            <div className="hidden sm:flex gap-3">
              <a
                href="https://www.google.com/maps/place/Sharma+Pharmacy/@22.6200282,88.3271886"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-xl text-sm font-medium text-center hover:bg-primary-700 active:bg-primary-800 transition-colors"
              >
                📍 Get Directions
              </a>
              <a
                href="https://wa.me/918336027489?text=Hi%2C%20I%20have%20a%20question."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-accent-500 text-white px-4 py-3 rounded-xl text-sm font-medium text-center hover:bg-accent-600 active:bg-accent-700 transition-colors"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80 lg:h-full lg:min-h-[400px]">
              <iframe
                title="Sharma Pharmacy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.5!2d88.3271886!3d22.6200282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM3JzEyLjEiTiA4OMKwMTknMzcuOSJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* Directions button below map on mobile */}
            <a
              href="https://www.google.com/maps/place/Sharma+Pharmacy/@22.6200282,88.3271886"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors w-full lg:hidden"
            >
              📍 Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
