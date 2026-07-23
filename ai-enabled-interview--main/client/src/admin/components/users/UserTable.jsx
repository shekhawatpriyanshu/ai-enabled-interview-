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
    <div className="bg-white rounded-xl shadow overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

      <table className="w-full min-w-[800px]">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-4 text-left">
              Name
            </th>

            <th className="p-4 text-left">
              Email
            </th>

            <th className="p-4 text-center">
              Role
            </th>

            <th className="p-4 text-center">
              Verified
            </th>

            <th className="p-4 text-center">
              Status
            </th>

            <th className="p-4 text-center">
              Joined
            </th>

            <th className="p-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

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