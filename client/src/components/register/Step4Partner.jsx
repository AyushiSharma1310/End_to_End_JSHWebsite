export default function Step4Partner({ formData, handleChange }) {
  return (
    <>
      <input
        name="partner_organization"
        placeholder="Partner Organization"
        value={formData.partner_organization || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />

      <textarea
        name="partner_address"
        placeholder="Address of Partner"
        value={formData.partner_address || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        rows="3"
        required
      />

      <input
        name="partner_investigator_name"
        placeholder="Name of Partner Investigator (Co-PI)"
        value={formData.partner_investigator_name || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />

      <input
        name="partner_investigator_email"
        type="email"
        placeholder="Email of Co-PI"
        value={formData.partner_investigator_email || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />

      <div className="flex">
        <span className="bg-gray-200 px-3 flex items-center rounded-l-lg">
          +91
        </span>
        <input
          name="partner_investigator_mobile"
          placeholder="Mobile Number of Co-PI"
          value={formData.partner_investigator_mobile || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded-r-lg"
          maxLength="10"
          pattern="[0-9]{10}"
          required
        />
      </div>
    </>
  );
}