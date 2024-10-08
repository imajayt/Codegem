import React from 'react';
import { AccountCircle, Folder, ExitToApp, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { User } from '../../interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const sampleUser = {
  username: 'JohnDoe',
  email: 'john@example.com',
  profilePicture: 'https://via.placeholder.com/50',
  collectionsCount: 5,
  likedCollections: 10,
};

const RightSidebar = () => {

  const { loggedUser }: { loggedUser: User | null } = useSelector((state: RootState) => state.user)

  return (
    <div className="w-full bg-gray-100 p-4 rounded shadow">
      <div className="flex flex-col items-center mb-4">
        <img src={loggedUser?.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mr-2" />
        <div className='flex flex-col items-center' >
          <p className="capitalize font-semibold text-gray-800 text-lg ">{loggedUser?.firstName} {loggedUser?.lastName}</p>
          <p className="text-gray-600 ">{loggedUser?.email}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-gray-600">
          Collections Created: <span className="font-semibold text-gray-800">{sampleUser.collectionsCount}</span>
        </p>
        <p className="text-gray-600">
          Liked Collections: <span className="font-semibold text-gray-800">{sampleUser.likedCollections}</span>
        </p>
      </div>
      <div className="flex flex-col mb-4">
        <Link to="/more" className="text-teal-500 hover:underline">
          <Settings className="mr-2" />
          Account Settings
        </Link>
        <Link to="/" className="text-red-500 hover:underline">
          <ExitToApp className="mr-2" />
          Logout
        </Link>
      </div>
      <div className="mb-4">
        <h3 className="text-dark-slate-blue font-semibold mb-2">Collection Categories</h3>
        <ul className="list-disc pl-6">
          <li className="text-gray-600">Technology</li>
          <li className="text-gray-600">Design</li>
          <li className="text-gray-600">Programming</li>
          {/* Add more categories */}
        </ul>
      </div>
      <div>
        <h3 className="text-dark-slate-blue font-semibold mb-2">Popular Collections</h3>
        <ul className="list-disc">
          <li className="text-gray-600 list-none ">
            <Folder className="mr-2" />
            Awesome Web Design
          </li>
          <li className="text-gray-600 list-none ">
            <Folder className="mr-2" />
            JavaScript Wonders
          </li>
          {/* Add more popular collections */}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
