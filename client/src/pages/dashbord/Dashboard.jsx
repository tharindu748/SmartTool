import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../../components/DashProfile";
import DashSidebar from "../../components/DashSidebar";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  // Get the tab from the URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location]);

  return (
    <div className="max-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-56">
        <DashSidebar tab={tab} setTab={setTab} />
      </div>
      {/* Profile Section */}
      {/* {tab === 'profile' && <DashProfile />} */}
    </div>
  );
}
