import React, { useEffect } from 'react';
import { PeopleAlt, Update, PersonAdd, Image } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { User } from '../../interfaces';
import { getFriends, getSuggestedUsers } from '../../redux/actions/friend';
import { Link, useNavigate } from 'react-router-dom';
import { SampleProfileCoverImage, image1 } from '../../assets';

const RightSidebar = () => {

    //////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { friends, suggestedUsers }: { friends: User[], suggestedUsers: User[] } = useSelector((state: RootState) => state.friend)
    const { loggedUser }: { loggedUser: User | null } = useSelector((state: RootState) => state.user)

    //////////////////////////////////////////////////// STATES ///////////////////////////////////////////////

    //////////////////////////////////////////////////// USE EFFECTS ///////////////////////////////////////////////
    useEffect(() => {
        dispatch<any>(getFriends(friends.length == 0))
        dispatch<any>(getSuggestedUsers())
    }, [])

    //////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////

    //////////////////////////////////////////////////// COMPONENTS ///////////////////////////////////////////////
    const Friend = ({ friend }: { friend: User }) => (
        <li onClick={() => navigate(`/user/${friend._id}`)} className="flex gap-2 items-center mb-4 hover:bg-gray-100 rounded-md p-2 cursor-pointer">
            <div className="w-10 flex items-center rounded-full overflow-hidden">
                {friend.profilePicture ? (
                    <img
                        src={friend.profilePicture as string}
                        alt={friend.username}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="w-10 h-10 rounded-full bg-teal-blue  text-white text-lg capitalize flex items-center justify-center">
                        {friend.username.charAt(0)}
                    </span>
                )}
            </div>
            <div className="">
                <p className="text-teal-blue font-medium capitalize">
                    {friend.username}
                </p>
                <p className="text-cool-gray text-sm">
                    {friend.mutualFriends} Mutual Friends
                </p>
            </div>
        </li>

    )

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col items-center mb-4 gap-y-2 ">
                <img src={loggedUser?.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mr-2" />
                <div className='flex flex-col items-center gap-y-0.5 ' >
                    <p className="capitalize text-xl font-semibold text-gray-800">{loggedUser?.firstName} {loggedUser?.lastName}</p>
                    <p className="text-lg text-gray-600">{loggedUser?.email}</p>
                </div>
            </div>
            {/* Suggested to You */}
            <div className="bg-white p-3 rounded-lg shadow-md w-full ">
                <h2 className="text-lg font-semibold mb-2 text-dark-slate-blue">
                    Suggested to You
                </h2>
                <ul>
                    {suggestedUsers.slice(0, 4).map((friend, index) => (
                        <Friend friend={friend} key={index} />
                    ))}
                </ul>
            </div>
            {/* Your Friends */}
            <div className='bg-white p-3 rounded-lg shadow-md w-full ' >
                <h2 className="text-lg font-semibold mb-2 text-dark-slate-blue">
                    Your Friends
                </h2>
                <ul>
                    {friends.map((friend, index) => (
                        <Friend friend={friend} key={index} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RightSidebar;
