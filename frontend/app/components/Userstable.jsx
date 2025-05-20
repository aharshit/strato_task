import React, { useEffect, useState } from "react";

export default function UsersTable() {
  const [Users, SetUsers] = useState([]);
  const [Error, SetError] = useState(null);
  const [MfaFilter, SetMfaFilter] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((Res) => {
        if (!Res.ok) throw new Error(`HTTP ${Res.status}`);
        return Res.json();
      })
      .then((Data) => {
        const Parsed = Data.map((U) => ({
          HumanUser: U.HumanUser,
          CreateDate: new Date(U.CreateDate),
          PasswordChangedDate: new Date(U.PasswordChangedDate),
          LastAccessDate: new Date(U.LastAccessDate),
          DaysSinceLastPasswordChange: U.DaysSinceLastPasswordChange,
          DaysSinceLastAccess: U.DaysSinceLastAccess,
          MFAEnabled: U.MFAEnabled,
          PasswordExpired: U.PasswordExpired,
          Inactive: U.Inactive,
        }));
        SetUsers(Parsed);
      })
      .catch((Err) => SetError(Err.message));
  }, []);

  const Displayed = Users.filter(
    (U) => MfaFilter === null || U.MFAEnabled === MfaFilter
  );

  if (Error) {
    return <div className="text-red-600 p-4">Error: {Error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Security Status</h2>

      <div className="flex space-x-6 mb-4">
        <LegendItem color="bg-red-500" label="Password expired (>365d)" />
        <LegendItem color="bg-orange-500" label="Inactive (>90d)" />
        <LegendItem color="bg-green-500" label="Both expired & inactive" />
      </div>

    
      <div className="mb-4 space-x-3">
        {[
          { Label: "All", Value: null },
          { Label: "MFA Enabled", Value: true },
          { Label: "MFA Disabled", Value: false },
        ].map(({ Label, Value }) => (
          <button
            key={Label}
            onClick={() => SetMfaFilter(Value)}
            className={`px-4 py-2 rounded font-medium ${
              MfaFilter === Value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {Label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "User",
                "Created",
                "Password Changed",
                "Days Since PW Change",
                "Last Access",
                "Days Since Access",
                "MFA",
              ].map((H) => (
                <th
                  key={H}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                >
                  {H}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Displayed.map((U) => {
              const isExpired = U.PasswordExpired;
              const isInactive = U.Inactive;
              const RowClass = isExpired && isInactive
                ? "bg-green-500"
                : isExpired
                ? "bg-red-500"
                : isInactive
                ? "bg-orange-500"
                : "";

              return (
                <tr
                  key={U.HumanUser}
                  className={`${RowClass} hover:bg-gray-100 transition-colors`}
                >
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {U.HumanUser}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {U.CreateDate.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {U.PasswordChangedDate.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {U.DaysSinceLastPasswordChange}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {U.LastAccessDate.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {U.DaysSinceLastAccess}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {U.MFAEnabled ? "Yes" : "No"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function LegendItem({ color, label }) {
  return (
    <div className="flex items-center space-x-2">
      <span className={`w-4 h-4 rounded ${color}`}></span>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}