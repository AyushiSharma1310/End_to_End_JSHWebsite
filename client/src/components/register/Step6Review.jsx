export default function Step6Review({ formData, handleSubmit }) {
  return (
    <>
      <div className="space-y-4 max-h-96 overflow-y-auto">
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
          <p><strong>Problem Statement:</strong> {formData.problem_statement?.substring(0, 200)}...</p>
          <p><strong>Additional Info:</strong> {formData.additional_info?.substring(0, 200)}...</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 font-medium">⚠️ Final Submission Warning</p>
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
        ✅ Final Submit Registration
      </button>
    </>
  );
}