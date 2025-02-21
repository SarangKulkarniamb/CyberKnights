const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='relative w-full px-4 mb-6'>
			<div className='absolute inset-y-0 left-4 flex items-center pl-3 pointer-events-none'>
				<Icon className='size-5 text-black' />
			</div>
			<input
				{...props}
				className='w-full pl-10 pr-3 py-2  rounded-lg border border-gray-700 focus:border-blue-700  focus:ring-blue-500 text-black placeholder-gray-400 transition duration-200'
			/>
		</div>
	);
};
export default Input;