import React from "react";

const AnalyticsTable = ({
  title,
  columns,
  data,
}) => {
  return (
    <div className="bg-white rounded-xl shadow">

      <div className="border-b p-5">

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-sm font-semibold"
                >
                  {column.label}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>

                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-500"
                >
                  No Data Found
                </td>

              </tr>

            ) : (

              data.map((row, index) => (

                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  {columns.map((column) => (

                    <td
                      key={column.key}
                      className="px-6 py-4"
                    >
                      {row[column.key]}
                    </td>

                  ))}

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AnalyticsTable;