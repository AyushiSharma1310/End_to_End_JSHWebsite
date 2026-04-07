import { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

export default function Step6Review({ formData, handleSubmit }) {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    setDownloading(true);
    try {
      const username = localStorage.getItem("username");
      const safeId = (username || formData.email || "registration_review")
        .replace(/\s+/g, "_")
        .toLowerCase();

      const opt = {
        margin: 10,
        filename: `${safeId}_review.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      };

      html2pdf().set(opt).from(printRef.current).save();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const ReviewContent = () => (
    <>
      <h3 className="text-lg font-semibold text-blue-600">Review Your Registration</h3>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <h4 className="font-medium">Basic Information:</h4>
        <p><strong>Name:</strong> {formData.full_name}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Mobile:</strong> {formData.mobile}</p>
        <p><strong>Location:</strong> {formData.city}, {formData.district}, {formData.state} - {formData.pincode}</p>
        <p><strong>Gender:</strong> {formData.gender}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <h4 className="font-medium">Proposal Details:</h4>
        <p><strong>Category:</strong> {formData.category}</p>
        <p><strong>Organization:</strong> {formData.organization}</p>
        <p><strong>Organization Address:</strong> {formData.organization_address}</p>
        <p><strong>Project Investigator:</strong> {formData.project_investigator_name}</p>
        <p><strong>PI Designation:</strong> {formData.project_investigator_designation}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <h4 className="font-medium">Partner Details:</h4>
        <p><strong>Partner Organization:</strong> {formData.partner_organization}</p>
        <p><strong>Partner Address:</strong> {formData.partner_address}</p>
        <p><strong>Co-PI Name:</strong> {formData.partner_investigator_name}</p>
        <p><strong>Co-PI Email:</strong> {formData.partner_investigator_email}</p>
        <p><strong>Co-PI Mobile:</strong> {formData.partner_investigator_mobile}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <h4 className="font-medium">Proposal Content:</h4>
        <p><strong>Title:</strong> {formData.proposal_title}</p>
        <p><strong>Problem Statement:</strong> {formData.problem_statement}</p>
        <p><strong>Additional Info:</strong> {formData.additional_info}</p>
      </div>
    </>
  );

  return (
    <>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <ReviewContent />
      </div>

      <div className="hidden">
        <div ref={printRef} className="space-y-4">
          <ReviewContent />
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold disabled:bg-gray-400"
      >
        {downloading ? "Downloading PDF..." : "Download Review PDF"}
      </button>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 font-medium">Final Submission Warning</p>
        <p className="text-yellow-700 text-sm mt-1">
          This is your final submission. Once submitted, you cannot make changes to your registration.
          Please review all information carefully before proceeding.
        </p>
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
      >
        Final Submit Registration
      </button>
    </>
  );
}
