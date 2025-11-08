import { Outlet } from 'react-router';
import Navbar from '../components/shared/Navber';
import Footer from '../components/shared/Footer';

const Main = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-306px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
