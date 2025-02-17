
import './contact.css';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {

  return (
    <div className="page-container">
      <div className="email-container">
        <p className="text">Pour me contacter, envoyez-moi un mail :</p>
        <p className="email">avrillon.benoit73@gmail.com</p>
      </div>
    </div>
  );
}
