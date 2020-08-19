import React from 'react';

export default function Footer() {
	return (
		<footer className='bg-dark mt-4 text-center text-white p-4'>
			copyright &copy; {new Date().getFullYear()} Devconnector
		</footer>
	);
}
