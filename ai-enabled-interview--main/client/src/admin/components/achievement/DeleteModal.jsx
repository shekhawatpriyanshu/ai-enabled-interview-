import React from "react";
import {
  FaExclamationTriangle,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const DeleteModal = ({
  open,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  onConfirm,
  onCancel,
  loading = false,
}) => {

  if (!open) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      {/* Modal */}

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">

              <FaExclamationTriangle className="text-red-600 text-xl" />

            </div>


            <h2 className="text-lg font-bold text-slate-800">
              {title}
            </h2>

          </div>


          <button
            onClick={onCancel}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <FaTimes />
          </button>


        </div>


        {/* Body */}

        <div className="px-6 py-6">

          <p className="text-slate-600 leading-6">
            {message}
          </p>


          <p className="mt-3 text-sm text-red-500 font-medium">
            This action cannot be undone.
          </p>


        </div>



        {/* Footer */}

        <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200">


          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
          >
            Cancel
          </button>



          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2 transition disabled:opacity-60"
          >

            {
              loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>

                  Deleting...
                </>
              )
              :
              (
                <>
                  <FaTrash />

                  Delete
                </>
              )
            }

          </button>


        </div>


      </div>

    </div>
  );
};


export default DeleteModal;