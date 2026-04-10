import { Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-10">

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Privacy Policy
        </h1>

        {/* Intro */}
        <p className="text-gray-700 leading-relaxed mb-6">
          This Privacy Policy governs the use of the{" "}
          <span className="font-semibold text-blue-700">
            Bharat WIN Mobile Application
          </span>, hosted on the Google Play Store. Bharat WIN is an initiative
          of the Department of Water Resources, River Development and Ganga
          Rejuvenation, Ministry of Jal Shakti, Government of India. The
          Application enables applicants to submit proposals for hackathons
          conducted under Bharat WIN.
        </p>

        {/* Sections */}
        <div className="space-y-6 text-gray-700 leading-relaxed">

          {/* User Info */}
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              User Provided Information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Mobile number</li>
              <li>Organization / Institution name</li>
              <li>Proposal and submission-related details</li>
            </ul>
          </div>

          {/* Auto Info */}
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Automatically Collected Information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Mobile device type and model</li>
              <li>Unique device identifiers</li>
              <li>IP address</li>
              <li>Operating system and browser type</li>
              <li>Usage patterns and interaction data</li>
            </ul>
          </div>

          {/* Disclosure */}
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Disclosure of Information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To comply with applicable laws, legal processes, or government requests</li>
              <li>To protect rights, safety, security, or prevent fraud and misuse</li>
            </ul>
            <p className="mt-2">
              Users may stop further data collection by uninstalling the Application.
            </p>
          </div>

          {/* Data Retention */}
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Data Retention & Storage
            </h2>
            <p>
              User-provided data is retained for as long as the Application is
              used and for a reasonable period thereafter. Automatically collected
              data may be stored in aggregated form.
            </p>
            <p className="mt-2 font-medium">
              All data is securely stored on servers of NIH, Roorkee, India.
            </p>
          </div>

          {/* Misuse */}
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Misuse by Non-Targeted Users
            </h2>
            <p>
              The Application is intended solely for registered applicants. Any misuse
              by unauthorized users should be prevented by the device owner.
            </p>
          </div>

          {/* Security */}
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Security
            </h2>
            <p>
              We implement physical, electronic, and procedural safeguards to protect
              the information we process. However, no system can guarantee absolute security.
            </p>
          </div>

          {/* Consent */}
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Your Consent
            </h2>
            <p>
              By using the Application, you consent to the collection and processing
              of your information in accordance with this Privacy Policy.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Contact Us
            </h2>
            <a
              href="mailto:hackathon.nihr@gov.in"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <Mail size={18} />
              hackathon.nihr@gov.in
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}