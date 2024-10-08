import React, { ChangeEvent, useState } from 'react';
import { CircularProgress, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup } from '../../redux/actions/group';
import { RootState } from '../../redux/store';
import { Close, Clear } from '@mui/icons-material';
import { Avatar } from '../../utils/Components';
import { image6 } from '../../assets';
import { Group, User } from '../../interfaces';
import { useGroupModal } from '../../hooks/useGroupModal';

const CreateGroup = () => {

    ///////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
    const dispatch = useDispatch();
    const { isOpen, onClose } = useGroupModal()
    const { loggedUser: user, isFetching }: { loggedUser: User | null, isFetching: boolean } = useSelector((state: RootState) => state.user);

    const initialGroup: Group = {
        name: "",
        avatar: "",
        admin: "",
        description: "",
        categories: [],
        members: [],
        codes: [],
        streaks: [],
        challenges: [],
        shares: [],
    }

    ///////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
    const [groupData, setGroupData] = useState(initialGroup);
    const [categoryValue, setCategoryValue] = useState('');

    ///////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
    const handleCreate = () => {
        const { name, description } = groupData
        if (!name || !description) return alert('Make sure to provide all the fields.')
        dispatch<any>(createGroup(groupData, onClose));
        setGroupData(initialGroup)
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setGroupData(pre => ({ ...pre, [e.target.name]: e.target.value }));
    };

    const handleFilterHashTag = (techToDelete: string) => {
        setGroupData({ ...groupData, categories: groupData.categories.filter((t) => t !== techToDelete) });
    };

    const handleAddHashTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        const value: string = e.currentTarget.value;
        if (!value.trim()) return;
        setGroupData({ ...groupData, categories: [...groupData.categories, value] });
        e.currentTarget.value = '';
        setCategoryValue('');
    };


    ///////////////////////////////////////////////////// COMPONENT ////////////////////////////////////////////////////
    const Category: React.FC<{ title: string }> = ({ title }) => (
        <div className="flex gap-[8px] items-center justify-between rounded-[16px] py-[2px] px-[6px] bg-teal-blue w-auto">
            <p className="text-white font-medium w-max text-[14px] ">{title}</p>
            <Clear
                onClick={() => handleFilterHashTag(title)}
                style={{ fontSize: '1rem' }}
                className={`cursor-pointer text-white text-[1rem] bg-lightGray  rounded-full `}
            />
        </div>
    );



    return (
        <Modal open={isOpen} onClose={onClose} className='flex justify-center items-center '>
            <div className='bg-white w-[35rem] min-h-[20rem] h-fit max-h-[90vh] overflow-y-scroll rounded-[8px] p-[1rem] ' >

                <div className='h-[12%] relative flex justify-center items-center pb-[12px] ' >
                    <h4 className='text-[22px] font-bold text-dark-slate-blue ' >Create Group</h4>
                    <button onClick={onClose} className='absolute right-0 w-[2rem] h-[2rem] rounded-full bg-transparent ' ><Close className='text-cool-gray' /></button>
                </div>

                <hr className='h-[2px] w-full py-[12px] text-warm-gray  ' />

                <div className='min-h-[82%] h-auto flex flex-col justify-between gap-[8px] ' >

                    {/* avatar */}
                    <div className='flex gap-[1rem] ' >
                        <Avatar src={image6} />
                        <div className='flex flex-col justify-center ' >
                            <p className='font-semibold text-dark-slate-blue capitalize ' >{user?.firstName} {user?.lastName}</p>
                        </div>
                    </div>



                    <div className='flex flex-col gap-[8px] ' >
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 ">
                                <label htmlFor="name" className='flex-[1] text-cool-gray ' >Name<span className='text-[18px] text-teal-blue-darken ' >*</span> :</label>
                                <input
                                    name='name'
                                    placeholder='Name..'
                                    value={groupData.name}
                                    onChange={(e) => handleChange(e)}
                                    className={`h-[40px] px-[4px] py-[2px] flex w-full outline-cool-gray bg-light-gray text-cool-gray border-cool-gray border-[1px] resize-none text-[16px] rounded-[4px] `}
                                />
                            </div>
                            <div className="flex flex-col gap-2 ">
                                <label htmlFor="description" className='flex-[1] text-cool-gray ' >Description<span className='text-[18px] text-teal-blue-darken ' >*</span> :</label>
                                <textarea
                                    rows={4}
                                    name='description'
                                    placeholder='Write a short description of the group?....'
                                    value={groupData.description}
                                    onChange={(e) => handleChange(e)}
                                    className={` px-[4px] py-[2px] flex w-full outline-cool-gray bg-light-gray text-cool-gray border-cool-gray border-[1px] resize-none text-[16px] rounded-[4px] `}
                                />
                            </div>
                            <div className="flex flex-col gap-2 ">
                                <label htmlFor="categories" className='flex-[1] text-cool-gray ' >Categories<span className='text-[18px] text-teal-blue-darken ' >*</span> :</label>
                                <div className={`${groupData.categories.length && 'py-[8px] '} min-h-[54px] max-h-[12rem] overflow-y-scroll px-[8px] flex flex-wrap gap-[8px] w-full bg-light-gray text-cool-gray border-[1px] border-cool-gray rounded-[4px] `} >
                                    <input
                                        className="border-none resize-none h-[40px] py-[8px] bg-inherit outline-none text-[14px] text-cool-gray w-full rounded-[4px] "
                                        placeholder="Technologies - separated by enter"
                                        value={categoryValue}
                                        onChange={(e) => setCategoryValue(e.target.value)}
                                        onKeyDown={handleAddHashTag}
                                    />
                                    {
                                        groupData.categories.map((category, index) => (
                                            <Category title={category} key={index} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        {/* buttons */}
                        <div className='flex flex-col gap-[8px] ' >
                            {/* group button */}
                            <div className='flex justify-end ' >
                                <button
                                    onClick={handleCreate}
                                    disabled={!groupData.name}
                                    className={` ${!groupData.name ? 'cursor-not-allowed ' : 'cursor-pointer '} flex justify-center items-center w-[6rem] rounded-[4px] p-[4px] bg-teal-blue text-white font-medium text-[18px] `} >
                                    {isFetching ? <CircularProgress style={{ width: '28px', height: '28px', color: '#fff' }} /> : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </Modal>
    );
};

export default CreateGroup;
