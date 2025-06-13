
import SideBar from '../components/Category/Sidebar';

export default function Home() {
  return (
    <div className="flex flex-1 h-full mt-4 justify-center">
    <div className="relative">
      <div className="absolute -translate-x-full"> {/* Utilisation de transform pour décaler */}
        <SideBar />
      </div>
    </div>
  </div>
  );
}
