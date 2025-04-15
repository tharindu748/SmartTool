const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold">SmartTool</h2>
            <p className="mt-2 text-sm text-gray-400">
              Streamlining tool procurement, service, and support.
            </p>
          </div>
  
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/support" className="hover:text-white">Support</a></li>
            </ul>
          </div>
  
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-400">
              <li><a href="/procurement" className="hover:text-white">Tool Procurement</a></li>
              <li><a href="/experts" className="hover:text-white">Expert Booking</a></li>
              <li><a href="/calculation" className="hover:text-white">Technical Calculations</a></li>
              <li><a href="/analytics" className="hover:text-white">Analytics Dashboard</a></li>
            </ul>
          </div>
  
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold">Contact</h3>
            <p className="mt-2 text-sm text-gray-400">SmartTool, Sri Lanka</p>
            <p className="text-sm text-gray-400">Email: info@smarttool.lk</p>
            <p className="text-sm text-gray-400">Phone: +94 11 123 4567</p>
          </div>
        </div>
  
        <div className="mt-10 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SmartTool. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  