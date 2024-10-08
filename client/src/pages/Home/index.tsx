import React, { useEffect, useState } from "react";
import Topbar from "./Topbar";
import Rightbar from "./Rightbar";
import { useDispatch, useSelector } from "react-redux";
import { getCodes } from "../../redux/actions/code";
import { RootState } from "../../redux/store";
import { Loader } from "../../utils/Components";
import CodeComponent from "../Codes/Code";

const Codes = () => {

  /////////////////////////////////////// VARIABLES //////////////////////////////////////////
  const dispatch = useDispatch()
  const { codes, isFetching } = useSelector((state: RootState) => state.code)

  /////////////////////////////////////// STATES //////////////////////////////////////////
  const [filters, setFilters] = useState({ codes: 'all', language: 'all' })

  /////////////////////////////////////// USE EFFECTS ///////////////////////////////////////
  useEffect(() => {
    dispatch<any>(getCodes(codes.length == 0))
  }, [])

  /////////////////////////////////////// FUNCTIONS /////////////////////////////////////////


  return (
    <div className="flex w-full  ">
      <div className={`lg:w-[75%] w-full h-full p-[1rem] flex justify-center `}>
        <div className="w-[48rem] flex flex-col h-full">
          <Topbar filters={filters} setFilters={setFilters} />
          <div className="w-full flex flex-col justify-between items-start gap-[2rem] mt-[1rem] " >
            {
              isFetching
                ?
                <div className="flex justify-center items-center w-full h-full">
                  <Loader />
                </div>
                :
                <>
                  {
                    codes?.map((code, index) => (
                      <CodeComponent key={index} code={code} />
                    ))
                  }
                </>
            }
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-[25%] bg-cool-gray-light p-4 rounded shadow">
        <Rightbar />
      </div>
    </div>
  );
};

export default Codes