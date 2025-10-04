import toast from 'react-hot-toast';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastLayout = ({ t, icon, title, message }) => (
  <div
    className={`${
      t.visible ? 'animate-enter' : 'animate-leave'
    } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black dark:ring-gray-700 ring-opacity-5`}
  >
    <div className="flex items-center p-4">
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
      <div className="flex border-l border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  </div>
);

export const showToast = {
  success: (message, title = 'Success') => {
    toast.custom((t) => (
      <ToastLayout
        t={t}
        icon={<FaCheckCircle className="h-6 w-6 text-green-500" />}
        title={title}
        message={message}
      />
    ));
  },

  error: (message, title = 'Error') => {
    toast.custom((t) => (
      <ToastLayout
        t={t}
        icon={<FaExclamationCircle className="h-6 w-6 text-red-500" />}
        title={title}
        message={message}
      />
    ));
  },

  info: (message, title = 'Information') => {
    toast.custom((t) => (
      <ToastLayout
        t={t}
        icon={<FaInfoCircle className="h-6 w-6 text-blue-500" />}
        title={title}
        message={message}
      />
    ));
  },
};