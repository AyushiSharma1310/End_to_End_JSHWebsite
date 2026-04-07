export default function Step5Proposal({ formData, handleChange }) {
  return (
    <>
      <input
        name="proposal_title"
        placeholder="Title of Proposal (20 words max)"
        value={formData.proposal_title || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        maxLength="100"
        required
      />
      <p className="text-sm text-gray-500">Maximum 20 words (100 characters)</p>

      <textarea
        name="problem_statement"
        placeholder="Problem Statement (500 words max)"
        value={formData.problem_statement || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        rows="6"
        maxLength="2500"
        required
      />
      <p className="text-sm text-gray-500">Maximum 500 words (2500 characters)</p>

      <textarea
        name="additional_info"
        placeholder="Additional Info (300 words max)"
        value={formData.additional_info || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        rows="4"
        maxLength="1500"
        required
      />
      <p className="text-sm text-gray-500">Maximum 300 words (1500 characters)</p>
    </>
  );
}