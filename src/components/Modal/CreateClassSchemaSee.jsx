"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

export default function CreateClassSchemaSee({ isOpen, closeModal, children, schema }) {
  if (!schema) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition
          show={isOpen}
          as={Fragment}
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
            <Transition
              show={isOpen}
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-screen">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Esquema
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 max-h-[70vh] overflow-y-auto border border-gray-200 rounded-lg p-4">
                  <textarea
                    value={schema}
                    readOnly
                    className="w-full h-full resize-none text-sm text-gray-800 whitespace-pre-wrap focus:outline-none"
                    rows={20}
                  />
                </div>

                <div className="mt-4">
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
