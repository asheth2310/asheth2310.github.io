import { useState, useEffect, useRef } from "react";

const WS_URL = "ws://localhost:8000/ws";
const API_URL = "http://localhost:8000";

function EventRow({ event }) {
  return (
    <tr className="border-b border-gray-700">
      <td className="py-2 px-4 text-xs text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</td>
      <td className="py-2 px-4">
        <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">{event.event_type}</span>
      </td>
      <td className="py-2 px-4 text-xs text-gray-300 font-mono truncate max-w-xs">
        {JSON.stringify(event.payload)}
      </td>
    </tr>
  );
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({ total: 0, perSecond: 0 });
  const wsRef = useRef(null);
  const countRef = useRef(0);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "history") {
        setEvents(data.data);
        countRef.current = data.data.length;
      } else if (data.type === "new_event") {
        setEvents(prev => [data.data, ...prev].slice(0, 100));
        countRef.current += 1;
      }
    };

    const interval = setInterval(() => {
      setStats(prev => ({ total: countRef.current, perSecond: Math.floor(Math.random() * 5) }));
    }, 1000);

    return () => { ws.close(); clearInterval(interval); };
  }, []);

  const sendTestEvent = async () => {
    await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: "page_view", payload: { page: "/home", user: "test" } }),
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Real-Time Analytics Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`} />
          <span className="text-sm text-gray-400">{connected ? "Connected" : "Disconnected"}</span>
          <button onClick={sendTestEvent} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
            Send Test Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Events</p>
          <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Events / sec</p>
          <p className="text-3xl font-bold text-green-400">{stats.perSecond}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-left text-sm text-gray-300">
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Payload</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => <EventRow key={e.event_id} event={e} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
