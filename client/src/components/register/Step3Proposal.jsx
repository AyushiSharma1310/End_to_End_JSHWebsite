export default function Step3Proposal({ formData, handleChange }) {
  return (
    <>
      <select
        name="category"
        value={formData.category || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      >
        <option value="">Select Category</option>
        <option value="1">Category 1</option>
        <option value="2">Category 2</option>
        <option value="3">Category 3</option>
        <option value="4">Category 4</option>
        <option value="5">Category 5</option>
      </select>

      <input
        name="organization"
        placeholder="Organization"
        value={formData.organization || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />

      <textarea
        name="organization_address"
        placeholder="Address of Organization"
        value={formData.organization_address || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        rows="3"
        required
      />

      <input
        name="project_investigator_name"
        placeholder="Name of Project Investigator"
        value={formData.project_investigator_name || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />

      <input
        name="project_investigator_designation"
        placeholder="Designation of PI"
        value={formData.project_investigator_designation || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />
    </>
  );
}