import React from 'react';

const Loading = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="flex items-center justify-center ">
                <input defaultChecked={true} type="checkbox" id="my-modal" className="modal-toggle" />
                <div className="modal bg-[#ffffff5a]">
                    <div className="h-screen flex justify-center items-center">
                        <div id="loading-animate" className="flex items-center justify-center ">
                            <span className="loader"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loading;