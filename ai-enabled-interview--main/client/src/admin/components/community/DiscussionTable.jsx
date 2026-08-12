import { Link } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaComments,
  FaThumbsUp,
  FaCommentDots,
  FaUser,
} from "react-icons/fa";

const DiscussionTable = ({
  discussions = [],
  loading = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="h-10 w-10 border-4 border-cyan-500/30 border-t-cyan-600 rounded-full animate-spin"></div>

        <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Loading Discussions...
        </p>
      </div>
    );
  }

  if (!discussions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/30 animate-bounce">
          <FaComments />
        </div>

        <h3 className="text-lg font-black text-slate-900">
          No Discussions Found
        </h3>

        <p className="text-slate-500 text-xs font-semibold">
          Try refining your search keyword or selected sort filter.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white
        rounded-3xl
        border border-slate-200/90
        shadow-xl
        overflow-x-auto
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]
      "
    >
      <table className="w-full min-w-[1100px] border-collapse text-left">
        {/* ================= HEADER ================= */}
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left w-[32%]">
              Discussion Topic
            </th>

            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left w-[25%]">
              Author
            </th>

            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[10%]">
              Likes
            </th>

            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[10%]">
              Comments
            </th>

            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[13%]">
              Created
            </th>

            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[150px]">
              Actions
            </th>
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody className="divide-y divide-slate-100">
          {discussions.map((discussion) => (
            <tr
              key={discussion._id}
              className="
                hover:bg-gradient-to-r
                hover:from-cyan-50/60
                hover:via-purple-50/30
                hover:to-indigo-50/40
                transition-all
                duration-300
                group
                align-top
              "
            >
              {/* ================= TOPIC ================= */}
              <td className="px-6 py-5 align-top">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-gradient-to-tr
                      from-cyan-500
                      to-blue-600
                      text-white
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-bold
                      shadow-md
                      shadow-cyan-500/20
                      group-hover:scale-110
                      group-hover:rotate-6
                      transition-transform
                      shrink-0
                    "
                  >
                    <FaComments />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    {/* FULL TITLE */}
                    <p
                      className="
                        font-black
                        text-sm
                        text-slate-900
                        group-hover:text-cyan-600
                        transition-colors
                        whitespace-normal
                        break-words
                      "
                    >
                      {discussion.title || "Untitled Discussion"}
                    </p>

                    {/* FULL CONTENT */}
                    <p
                      className="
                        text-xs
                        text-slate-500
                        font-medium
                        mt-1.5
                        whitespace-normal
                        break-words
                        leading-relaxed
                      "
                    >
                      {discussion.content ||
                        "No discussion content available."}
                    </p>
                  </div>
                </div>
              </td>

              {/* ================= AUTHOR ================= */}
              <td className="px-6 py-5 align-top">
                <div className="flex items-start gap-2.5">
                  {/* Avatar */}
                  <div
                    className="
                      w-9
                      h-9
                      rounded-lg
                      bg-indigo-50
                      text-indigo-600
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-bold
                      shrink-0
                    "
                  >
                    {discussion.user?.name ? (
                      discussion.user.name.charAt(0).toUpperCase()
                    ) : (
                      <FaUser />
                    )}
                  </div>

                  {/* Author Information */}
                  <div className="min-w-0">
                    {/* FULL NAME */}
                    <p
                      className="
                        font-extrabold
                        text-xs
                        text-slate-900
                        whitespace-normal
                        break-words
                      "
                    >
                      {discussion.user?.name || "Anonymous"}
                    </p>

                    {/* FULL EMAIL */}
                    <p
                      className="
                        text-[11px]
                        text-slate-400
                        font-semibold
                        mt-1
                        whitespace-normal
                        break-all
                      "
                    >
                      {discussion.user?.email || "-"}
                    </p>
                  </div>
                </div>
              </td>

              {/* ================= LIKES ================= */}
              <td className="px-6 py-5 text-center align-top">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    px-2.5
                    py-1
                    rounded-lg
                    bg-rose-50
                    text-rose-700
                    border
                    border-rose-200
                    text-xs
                    font-extrabold
                  "
                >
                  <FaThumbsUp className="text-rose-500 text-[11px]" />

                  {discussion.totalLikes || 0}
                </span>
              </td>

              {/* ================= COMMENTS ================= */}
              <td className="px-6 py-5 text-center align-top">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    px-2.5
                    py-1
                    rounded-lg
                    bg-cyan-50
                    text-cyan-700
                    border
                    border-cyan-200
                    text-xs
                    font-extrabold
                  "
                >
                  <FaCommentDots className="text-cyan-500 text-[11px]" />

                  {discussion.totalComments || 0}
                </span>
              </td>

              {/* ================= CREATED ================= */}
              <td className="px-6 py-5 text-center align-top">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                  {discussion.createdAt
                    ? new Date(
                      discussion.createdAt
                    ).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                    : "-"}
                </span>

                <p className="text-[10px] text-slate-400 mt-1">
                  {discussion.createdAt
                    ? new Date(
                      discussion.createdAt
                    ).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : ""}
                </p>
              </td>

              {/* ================= ACTIONS ================= */}
              <td className="px-6 py-5 align-top">
                <div className="flex justify-center items-center gap-1.5">
                  {/* VIEW */}
                  <Link
                    to={`/admin/community/discussion/${discussion._id}`}
                    className="
                      w-8
                      h-8
                      rounded-xl
                      bg-cyan-50
                      text-cyan-600
                      hover:bg-cyan-600
                      hover:text-white
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-bold
                      transition-all
                      shadow-sm
                      hover:shadow
                      hover:scale-105
                      active:scale-95
                      cursor-pointer
                    "
                    title="View Discussion"
                  >
                    <FaEye />
                  </Link>

                  {/* EDIT */}
                  <button
                    onClick={() =>
                      onEdit && onEdit(discussion)
                    }
                    className="
                      w-8
                      h-8
                      rounded-xl
                      bg-indigo-50
                      text-indigo-600
                      hover:bg-indigo-600
                      hover:text-white
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-bold
                      transition-all
                      shadow-sm
                      hover:shadow
                      hover:scale-105
                      active:scale-95
                      cursor-pointer
                    "
                    title="Edit Discussion"
                  >
                    <FaEdit />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() =>
                      onDelete && onDelete(discussion)
                    }
                    className="
                      w-8
                      h-8
                      rounded-xl
                      bg-rose-50
                      text-rose-600
                      hover:bg-rose-600
                      hover:text-white
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-bold
                      transition-all
                      shadow-sm
                      hover:shadow
                      hover:scale-105
                      active:scale-95
                      cursor-pointer
                    "
                    title="Delete Discussion"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiscussionTable;