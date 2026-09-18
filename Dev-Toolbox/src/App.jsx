import React from 'react'
import Conversions from "./components/Conversions.jsx";
import Listbox from "./components/Listbox.jsx";

function App() {
    return (
        <>
            <div className="bg-black text-white min-h-screen ">
                <div className=" text-4xl  pt-6 font-bold flex flex-row justify-center mb-5">
                    Dev Toolbox

                </div>
                <div className="flex flex-row justify-center items-center ">
                    {/*<button className="bg-purple-300  text-purple-900 rounded-2xl m-5 p-2">*/}
                    {/*    convert*/}
                    {/*</button>*/}

                </div>

                <Conversions/>
            </div>

        </>

    )
}

export default App
