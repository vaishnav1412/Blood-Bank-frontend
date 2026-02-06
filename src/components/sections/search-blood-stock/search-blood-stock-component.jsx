import { useState } from "react";
import GroupedHeadingComponent from "../grouped-heading/grouped-heading-component";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import "./search-blood-stock.scss"
const SearchBloodStockComponent = ({
	subheadingText,
	headingText,
	classHint,
}) => {
	const [district, setDistrict] = useState("");
const [taluk, setTaluk] = useState("");
const [bloodGroup, setBloodGroup] = useState("");
const [availableDonors, setAvailableDonors] = useState([]);

const handleSearch = (e) => {
	e.preventDefault(); // prevent page reload on form submit

	// Dummy data - replace this with actual fetch logic (e.g., from MongoDB or API)
	const allDonors = [
		{ name: "Rahul", bloodGroup: "A+", district: "District1", taluk: "Taluk1", contact: "9876543210" },
		{ name: "Aisha", bloodGroup: "B-", district: "District2", taluk: "Taluk2", contact: "9123456780" },
		{ name: "Manu", bloodGroup: "A+", district: "District1", taluk: "Taluk1", contact: "9998887776" },
		// Add more entries...
	];

	const filtered = allDonors.filter(
		(donor) =>
			donor.bloodGroup === bloodGroup &&
			donor.district === district &&
			donor.taluk === taluk
	);

	setAvailableDonors(filtered);
};

	return (
		<WrapperSection>
			<div
	className={`${classHint}  search-wrapper flex flex-col justify-center items-center w-full relative p-6 py-10 sm:py-20 sm:p-20 rounded-rmd z-[25] overflow-hidden -mt-[490px]`}
>
	<GroupedHeadingComponent
					subheadingText={subheadingText}
					headingText={headingText}
					mode="dark"
					position="center"
				/>

	<div className="w-full mt-10">
		<form className="grid grid-cols-1 sm:grid-cols-6 gap-2 w-full">
			<select
				name="district"
				id="district"
				className="w-full p-5 border sm:col-span-2 border-none bg-[#D9D9D9] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
				onChange={(e) => setDistrict(e.target.value)}
				value={district}
			>
				<option value="" selected disabled hidden>
					--Select District--
				</option>
				<option value="District1">District 1</option>
				<option value="District2">District 2</option>
				{/* Add other districts */}
			</select>

			<select
				name="taluk"
				id="taluk"
				className="w-full p-5 border sm:col-span-2 border-none bg-[#D9D9D9] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
				onChange={(e) => setTaluk(e.target.value)}
				value={taluk}
			>
				<option value="" selected disabled hidden>
					--Select Taluk--
				</option>
				<option value="Taluk1">Taluk 1</option>
				<option value="Taluk2">Taluk 2</option>
				{/* Add other taluks */}
			</select>

			<select
				name="bloodGroup"
				id="bloodGroup"
				className="w-full p-5 border sm:col-span-1 border-none bg-[#D9D9D9] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
				onChange={(e) => setBloodGroup(e.target.value)}
				value={bloodGroup}
			>
				<option value="" selected disabled hidden>
					--Blood Group--
				</option>
				<option value="A+">A+</option>
				<option value="A-">A-</option>
				<option value="B+">B+</option>
				<option value="B-">B-</option>
				<option value="AB+">AB+</option>
				<option value="AB-">AB-</option>
				<option value="O+">O+</option>
				<option value="O-">O-</option>
			</select>

			<button
				className="sm:col-span-1 sm:rounded-r-rsm border-dark text-white bg-dark hover:border-dark hover:bg-dark_red hover:text-white transition text-black px-8 py-5 text-sm font-bold"
				onClick={handleSearch}
			>
				Find Donors
			</button>
		</form>

		{/* Result Table */}
		<div className="mt-10 w-full bg-[#d9d9d9] rounded-rsm p-5 justify-start items-start overflow-x-scroll">
			<h3 className="text-lg font-semibold mb-4 text-dark_red">Available Donors</h3>
			<table className="w-full overflow-x-scroll">
				<thead>
					<tr className="grid grid-cols-6 text-start mb-5 border-b border-off_white pb-5">
						<th className="col-span-2 text-sm uppercase tracking-widest text-red">Name</th>
						<th className="col-span-2 text-sm uppercase tracking-widest text-red">Blood Group</th>
						<th className="col-span-2 text-sm uppercase tracking-widest text-red">Contact Number</th>
					</tr>
				</thead>
				<tbody>
					{availableDonors.map((donor, index) => (
						<tr key={index} className="grid grid-cols-6 mb-3 border-b border-off_white pb-3">
							<td className="col-span-2 sm:text-lg font-medium">{donor.name}</td>
							<td className="col-span-2 sm:text-lg font-medium">{donor.bloodGroup}</td>
							<td className="col-span-2 sm:text-lg font-medium">{donor.contact}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</div>
</div>
		</WrapperSection>
	);
};

export default SearchBloodStockComponent;
