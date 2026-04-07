export default function Step1Basic({ formData, handleChange, nextStep }) {
  return (
    <>
      <input
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />

      <div className="flex">
        <span className="bg-gray-200 px-3 flex items-center rounded-l-lg">
          +91
        </span>
        <input
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full border p-3 rounded-r-lg"
          required
        />
      </div>

      <button
        type="button"
        onClick={nextStep}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Continue
      </button>
    </>
  );
}