"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
export default function VideoSee({ isOpen, closeModal,src, children }) {
    if (!src) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => {closeModal(); }}>
                <Transition show={isOpen} as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition show={isOpen} as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="w-full max-w-md transform overflow-hidden rounded-2xl mb-5 bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-end items-center mb-4">
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className='flex justify-center items-center'>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Video Doblado
                                    </h3>
                                </div>
                                <div className='flex justify-center flex-col gap-2 mt-4'>
                                    <video src={src} controls></video>                                            
                                </div>
                                <div className="mt-2">
                                    {children}
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
