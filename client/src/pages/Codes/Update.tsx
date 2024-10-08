import React, { ChangeEvent } from 'react'
import { Cancel, Close, Lock, ArrowDropDown, Clear } from '@mui/icons-material'
import { image6 } from '../../assets'
import { Avatar } from '../../utils/Components'
import { useState, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Modal } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { updateCode } from "../../redux/actions/code"
import { useCodeModal } from '../../hooks/useCodeModal'
import { RootState } from '../../redux/store'
import { Code, User } from '../../interfaces'

const UpdateModal = () => {
    ///////////////////////////// VARIABLES /////////////////////////////////////
    const { isFetching } = useSelector((state: RootState) => state.user)
    const { isOpen, onClose, code } = useCodeModal()
    const dispatch = useDispatch()
    const menu = [
        'private',
        'public',
        'friends only',
        'all friends except',
        'only share with',
    ]

    ///////////////////////////// STATES ////////////////////////////////////////
    const [codeData, setCodeData] = useState(code)
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false)
    const [hashTagValue, setHashTagValue] = useState('')

    ///////////////////////////// USE EFFECTS ///////////////////////////////////

    ///////////////////////////// FUNCTIONS //////////////////////////////////////
    const handleUpdate = () => {
        dispatch<any>(updateCode(codeData?._id as string, codeData, onClose))
    }
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCodeData((pre) => ({ ...(pre as Code), [e.target.name]: e.target.value }))
    }
    const handleFilterHashTag = (techToDelete: string) => {
        if (!codeData) return
        setCodeData({ ...codeData, hashTags: codeData.hashTags.filter((t) => t !== techToDelete) })
    }
    const handleAddHashTag = (e: any) => {
        if (!codeData) return
        if (!(e.key == 'Enter')) return
        const value = e.target.value
        if (!value.trim()) return
        setCodeData({ ...codeData, hashTags: codeData.hashTags?.concat(value) })
        e.target.value = ""
        setHashTagValue('')
    }

    const HashTag = ({ title }: { title: string }) => (
        <div className="flex gap-[8px] items-center justify-between rounded-[16px] py-[2px] px-[6px] bg-teal-blue w-auto " >
            <p className="text-white font-medium w-max text-[14px] " >{title}</p>
            <Clear style={{ fontSize: '1rem' }} onClick={() => handleFilterHashTag(title)} className={`cursor-pointer text-white text-[1rem] bg-lightGray  rounded-full `} />
        </div>
    )



    return (
        <>
            <Modal open={isOpen} onClose={() => onClose()} className='flex justify-center items-center ' >
                <div className='bg-white w-[50vw] min-h-[20rem] h-fit max-h-[90vh] overflow-y-scroll rounded-[8px] p-[1rem] ' >

                    <div className='h-[12%] relative flex justify-center items-center pb-[12px] ' >
                        <h4 className='text-[22px] font-bold text-dark-slate-blue ' >Update Code</h4>
                        <button onClick={() => onClose()} className='absolute right-0 w-[2rem] h-[2rem] rounded-full bg-transparent ' ><Close className='text-cool-gray' /></button>
                    </div>

                    <hr className='h-[2px] w-full py-[12px] text-warm-gray  ' />

                    <div className='min-h-[82%] h-auto flex flex-col justify-between gap-[8px] ' >

                        {/* avatar */}
                        <div className='flex gap-[1rem] ' >
                            <Avatar src={image6} />
                            <div className='flex flex-col ' >
                                <p className='font-semibold text-dark-slate-blue ' >Nauman Ch</p>
                                <div className='relative flex flex-col justify-center items-start gap-[4px] cursor-pointer rounded-t-[4px] min-w-[9rem] bg-gray-100 ' >

                                    <button onClick={() => setShowVisibilityMenu(pre => !pre)} className='w-full flex justify-between items-center p-[2px] ' >
                                        <span className="flex justify-start gap-[2px] capitalize " >
                                            <Lock style={{ fontSize: '16px' }} className='text-[16px] ' />
                                            <span className='text-[12px] font-medium ' >{codeData?.visibility}</span>
                                        </span>
                                        <ArrowDropDown />
                                    </button>
                                    {
                                        showVisibilityMenu &&
                                        <div className='w-full absolute top-full bg-white shadow-box flex flex-col items-start gap-[4px] rounded-b-[4px] ' >
                                            {
                                                menu.filter(m => m != codeData?.visibility).map((item, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => { setShowVisibilityMenu(false); setCodeData({ ...(codeData as Code), visibility: item }) }}
                                                        className='w-full gap-[2px] text-start hover:bg-teal-blue-lighten hover:text-white text-cool-gray capitalize p-[2px] '
                                                    >
                                                        <Lock style={{ fontSize: '16px' }} className='text-[16px] ' />
                                                        <span className='text-[12px] font-medium ' >{item}</span>
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>



                        <div className='flex flex-col gap-[8px] ' >
                            <div className="flex gap-[1rem] ">
                                <div className="flex flex-col gap-[4px] w-[55%] ">
                                    <label htmlFor="description" className='flex-[1] text-cool-gray ' >Description<span className='text-[18px] text-teal-blue-darken ' >*</span> :</label>
                                    <textarea
                                        rows={4}
                                        name='description'
                                        value={codeData?.description}
                                        onChange={handleChange}
                                        placeholder='Write a short description of the code?....'
                                        className={`h-full px-[4px] py-[2px] flex w-full outline-cool-gray bg-light-gray text-cool-gray border-cool-gray border-[1px] resize-none text-[16px] rounded-[4px] `}
                                    />
                                </div>
                                <div className={`flex flex-col gap-[4px] w-[45%] `}  >
                                    <div className='flex flex-col justify-start gap-[4px] w-full  ' >
                                        <label htmlFor="title" className='flex-[1] text-cool-gray ' >Title:</label>
                                        <textarea
                                            name='title'
                                            rows={2}
                                            placeholder='Your title here....'
                                            value={codeData?.title}
                                            onChange={handleChange}
                                            className={`px-[4px] py-[2px] flex w-full outline-cool-gray bg-light-gray text-cool-gray border-cool-gray border-[1px] resize-none text-[16px] rounded-[4px] `}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-[4px] ">
                                        <h6 className={`capitalize w-full text-[16px] text-cool-gray  `}>Technologies:</h6>
                                        <div className={`${codeData?.hashTags?.length && 'py-[8px] '} min-h-[54px] max-h-[12rem] overflow-y-scroll px-[8px] flex flex-wrap gap-[8px] w-full bg-light-gray text-cool-gray border-[1px] border-cool-gray rounded-[4px] `} >
                                            <input
                                                className="border-none resize-none h-[40px] py-[8px] bg-inherit outline-none text-[14px] text-cool-gray w-full rounded-[4px] "
                                                placeholder="Technologies - separated by enter"
                                                value={hashTagValue}
                                                onChange={(e) => setHashTagValue(e.target.value)}
                                                onKeyDown={handleAddHashTag}
                                            />
                                            {
                                                codeData?.hashTags.map((tech, index) => (
                                                    <HashTag title={tech} key={index} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* code */}
                            <div className='flex flex-col justify-start gap-[4px] ' >
                                <label htmlFor="code" className='flex-[1] text-cool-gray ' >Code<span className='text-[18px] text-teal-blue-darken ' >*</span> :</label>
                                <TextareaAutosize
                                    rows={10}
                                    maxRows={10}
                                    name='code'
                                    placeholder='Paste your code here....'
                                    value={codeData?.code}
                                    onChange={handleChange}
                                    className={`px-[4px] py-[2px] flex flex-[5] w-full outline-cool-gray bg-light-gray text-cool-gray border-cool-gray border-[1px] resize-none text-[16px] rounded-[4px] `}
                                />
                            </div>

                            {/* buttons */}
                            <div className='flex flex-col gap-[8px] ' >
                                {/* code button */}
                                <div className='flex justify-end ' >
                                    <button onClick={handleUpdate} disabled={!codeData?.code} className={` ${!codeData?.code ? 'cursor-not-allowed ' : 'cursor-pointer '}  w-[6rem] rounded-[4px] p-[4px] bg-teal-blue text-white font-medium text-[18px] `} >
                                        {isFetching ? 'updating...' : 'Update'}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </Modal>







        </>
    )
}

export default UpdateModal
