import { XMarkIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

export default function Sidebar({ isOpen, setSidebarOpen }) {
  return (
    <>
      {/* Sidebar */}
      <Transition
        show={isOpen}
        enter="transition-transform duration-300"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="fixed inset-y-0 left-0 w-64 bg-[#393269] text-white z-50 flex flex-col shadow-lg">
          <div className="flex justify-end p-4">
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="p-4">
            {/* Sidebar Content */}
            <ul className="space-y-4">
              <li><a href="#" className="text-white">Dashboard</a></li>
              <li><a href="#" className="text-white">Complaints</a></li>
              <li><a href="#" className="text-white">Works</a></li>
              <li><a href="#" className="text-white">Reports</a></li>
            </ul>
          </div>
        </div>
      </Transition>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-40"
        />
      )}
    </>
  );
}
