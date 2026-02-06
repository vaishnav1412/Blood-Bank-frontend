import WrapperSection from "../wrapper-section/wrapper-section-component";

const ContactForm = ({
	fields,
	heading,
	buttonText,
	formData,
	setFormData,
	handleSubmit,
}) => {
	

	const districtOptions = [
		"Kasaragod", "Kannur", "Wayanad", "Kozhikode", "Malappuram",
		"Palakkad", "Thrissur", "Ernakulam", "Idukki", "Kottayam",
		"Alappuzha", "Pathanamthitta", "Kollam", "Thiruvananthapuram"
	];
const inputStyles = `block w-full rounded-rsm border-0 px-8 py-3 md:px-10 md:py-4 bg-light text-white placeholder:text-white outline-none focus:ring-1 focus:ring-center focus:bg-dark focus:ring-light sm:text-sm sm:leading-6`;
	return (
		<WrapperSection>
			<div className="form-wrapper -mt-[10em] w-full relative p-6 py-10 lg:p-20 lg:pb-10 rounded-rmd z-[25] overflow-hidden">
				<h3 className="not-italic text-center font-medium text-[16px] sm:text-[25px] leading-[34px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white">
					{heading}
				</h3>

				<form
					className="contact-form space-y-6 max-w-md w-full mx-auto relative sm:p-6 py-8 sm:p-10 rounded-rmd z-[25] overflow-hidden flex-col"
					onSubmit={handleSubmit}
				>
					{fields.map((field) => {
						if (field.name === "reason") {
							return (
								<textarea
									key={field.key}
									name={field.name}
									id={field.name}
									value={formData[field.name]}
									onChange={(e) =>
										setFormData({ ...formData, [field.name]: e.target.value })
									}
									placeholder={field.placeholder}
									required={field.required}
									className={`${inputStyles} h-32 resize-none`}
								/>
							);
						} else if (field.name === "district") {
							return (
								<select
									key={field.key}
									name="district"
									id="district"
									value={formData.district}
									onChange={(e) =>
										setFormData({ ...formData, district: e.target.value })
									}
									required
									className={`${inputStyles} bg-dark text-white`}
								>
									<option value="">Select District</option>
									{districtOptions.map((district) => (
										<option key={district} value={district}>
											{district}
										</option>
									))}
								</select>
							);
						} else if (field.type === "date") {
							return (


								<input
									key={field.key}
									type="date"
									name={field.name}
									id={field.name}
									value={formData[field.name]}
									onChange={(e) =>
										setFormData({ ...formData, [field.name]: e.target.value })
									}
									required={field.required}
									className={inputStyles}
								/>


								
							);
						} else {
							return (
								<input
									key={field.key}
									type={field.type}
									name={field.name}
									id={field.name}
									value={formData[field.name]}
									onChange={(e) =>
										setFormData({ ...formData, [field.name]: e.target.value })
									}
									placeholder={field.placeholder}
									required={field.required}
									className={inputStyles}
								/>
							);
						}
					})}

					<div className="grid place-items-center gap-5 mb-5 w-full">
						<button
							type="submit"
							className="rounded-rsm border border-white hover:border-red text-dark bg-white hover:bg-red hover:text-white transition px-10 py-4 text-sm w-full font-bold cursor-pointer"
						>
							{buttonText}
						</button>
					</div>

					{/* Optional status message */}
					{status && (
						<p className="text-center text-green-400 text-sm">{status}</p>
					)}
				</form>
			</div>
		</WrapperSection>
	);
};

export default ContactForm;
