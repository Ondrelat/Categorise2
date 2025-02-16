// Footer.tsx
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-auto">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div>
          <p>&copy; {new Date().getFullYear()} Dictée intéractive.</p>
        </div>
        <div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;