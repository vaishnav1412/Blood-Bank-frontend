export const labelStyles = `
    absolute left-4 transition-all duration-200 pointer-events-none
    peer-focus:text-xs peer-focus:-top-2 peer-focus:text-pink-600
  `;

export const inputStyles = `
    block w-full rounded-lg border-2 px-4 py-3
    bg-white text-gray-800 placeholder-transparent outline-none
    transition-all duration-200
    focus:border-pink-500 focus:ring-2 focus:ring-pink-200
    hover:border-pink-300 sm:text-sm peer
  `;
export const registerInputStyles = `block w-full rounded-lg border-2 px-4 py-3
 md:px-6 md:py-3.5 bg-white text-gray-800 placeholder-transparent outline-none 
 transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 
 focus:bg-white sm:text-sm peer`;

export  const registerSelectStyles = `
  block w-full rounded-lg border-2 px-4 py-3 md:px-6 md:py-3.5
  bg-white text-gray-800 outline-none
  transition-all duration-200
  focus:border-pink-500 focus:ring-2 focus:ring-pink-200
  hover:border-pink-300
  appearance-none cursor-pointer
  sm:text-sm peer
`;

export  const reuseableClass = {
    for_last: `last:bg-button_original last:text-white last:hover:bg-white last:hover:text-dark`,
    for_second_last: `rounded-rsm border border-white/[.5] hover:bg-white hover:text-dark`,
  };

