import { Routes, Route } from 'react-router-dom';

// pages & components
import Questionaire from './pages/skillQuestionaire';
import Browse from './pages/Browse';
import FAQ from './pages/FAQ';
import Home from './pages/preHome';
import PostHome from './pages/Home';
import Profile from './pages/profile';
import EditProfile from './pages/editProfile';
import Signin from './pages/Signin';
import OtherUser from './pages/OtherUser';
import Messages from './pages/Messages';
import SearchPage from './pages/searchpage';

function App() {
  return (
    <div className="App">
      <div className="pages">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<PostHome />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/user/:username" element={<OtherUser />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/questionaire" element={<Questionaire />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;