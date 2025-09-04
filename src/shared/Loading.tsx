import React from 'react';

interface LoadingProps {
    modal?: boolean;
    size?: number;
    screenHeight?:number;
}

const Loading = ({ modal = true, size = 10, screenHeight = 100 }: LoadingProps) => {
    return (
        <div style={{ height: `${screenHeight}vh` }} className="flex justify-center items-center">
            <div className="flex items-center justify-center ">
                {
                    modal ? (
                        <>
                            <input defaultChecked={true} type="checkbox" id="my-modal" className="modal-toggle" />
                            <div className="modal bg-[#ffffff5a]">
                                <div className="h-screen flex justify-center items-center">
                                    <div id="loading-animate" className="flex items-center justify-center ">
                                        <span className={`loader`} style={{ fontSize: `${size}px` }}></span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : 
                        <div id="loading-animate" className="flex items-center justify-center ">
                            <span className={`loader`} style={{ fontSize: `${size}px` }}></span>
                        </div>
                   
                }

            </div>
        </div>
    );
};

export default Loading;