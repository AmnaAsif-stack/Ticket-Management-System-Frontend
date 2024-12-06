import React from "react";

const ManageTickets = () => {
  const tickets = [
    { id: 1, route: "City A to City B", date: "2024-12-01", status: "Confirmed" },
    { id: 2, route: "City C to City D", date: "2024-12-02", status: "Cancelled" },
  ];

  return (
    <div className="container">
      <h2>Manage Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <div>
              <strong>Route:</strong> {ticket.route} - {ticket.date}
              <span className={`status ${ticket.status.toLowerCase()}`}>
                {ticket.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTickets;
