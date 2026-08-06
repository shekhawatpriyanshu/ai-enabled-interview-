import UserRow from "../../../admin/components/users/UserRow";

const UserTable = ({
  users,
  onView,
  onEdit,
  onDelete,
  onBlock,
  onRole,
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      <table className="w-full min-w-[850px] text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
              Candidate Name
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
              Email Address
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
              Role
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
              Verification
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
              Status
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
              Joined Date
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center w-[180px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onBlock={onBlock}
              onRole={onRole}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;