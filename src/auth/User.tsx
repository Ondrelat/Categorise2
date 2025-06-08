import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { Session, getServerSession } from "next-auth";
import { LogoutButton } from "@/src/auth/LogoutButton";
import '@/app/globals.css';
import Image from 'next/image';

export const User = async () => {
    const session = await getServerSession(authConfig);
    if(!session?.user){
        return <p>No user</p>
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {session.user.image && (
                <Image 
                    src={session.user.image ?? ''} 
                    alt="User Image"
                    width="50" // Définissez la largeur souhaitée
                    height="50" // Définissez la hauteur souhaitée
                    style={{ borderRadius: '50%' }} // Optionnel: pour un aspect rond
                />
            )}
            <p style={{ marginLeft: '10px' }}>{session.user.name}</p> {/* Ajout de marginLeft pour espacer le texte */}
        </div>
    )
}
