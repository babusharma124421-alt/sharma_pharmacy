import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-700 font-bold text-lg">S</span>
              </div>
              <span className="font-semibold text-lg">Sharma Pharmacy</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              Your trusted neighbourhood pharmacy with in-house doctor consultation services.
            </p>
            {/* Social / Quick contact for mobile */}
            <div className="flex gap-3 mt-4">
              <a
                href="tel:+918336027489"
                className="w-10 h-10 bg-primary-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Call us"
              >
                📞
              </a>
              <a
                href="https://wa.me/918336027489"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent-600 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                💬
              </a>
              <a
                href="https://www.google.com/maps/place/Sharma+Pharmacy/@22.6200282,88.3271886"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Directions"
              >
                📍
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-100">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-primary-200">
              <li>
                <Link href="/search" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🔍</span> Medicine Search
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🩺</span> Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/prescription" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>📋</span> Upload Prescription
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🚚</span> Home Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-100">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-200">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>88, Mirpara Rd, Bhatta Nagar, Liluah, Howrah, West Bengal 711203</span>
              </li>
              <li>
                <a href="tel:+918336027489" className="flex items-center gap-2 hover:text-white">
                  <span>📞</span> +91 8336027489
                </a>
              </li>
              <li>
                <a href="mailto:somnathsharma2012@gmail.com" className="flex items-center gap-2 hover:text-white break-all">
                  <span>✉️</span> somnathsharma2012@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Map + CTA */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-100">Find Us</h4>
            <div className="space-y-3">
              <a
                href="https://www.google.com/maps/place/Sharma+Pharmacy/@22.6200282,88.3271886"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-600 active:bg-primary-500 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full"
              >
                <span>📍</span> Get Directions
              </a>
              <a
                href="https://wa.me/918336027489"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-500 active:bg-accent-400 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full"
              >
                <span>💬</span> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-6 text-center text-sm text-primary-300">
          © {new Date().getFullYear()} Sharma Pharmacy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
