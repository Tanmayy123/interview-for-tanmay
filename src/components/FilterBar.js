import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const QUICK_RANGES = [
  { label: "All Time", getRange: () => "all" },
  {
    label: "Past week",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 7);
      return [from, to];
    },
  },
  {
    label: "Past month",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(to.getMonth() - 1);
      return [from, to];
    },
  },
  {
    label: "Past 3 months",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(to.getMonth() - 3);
      return [from, to];
    },
  },
  {
    label: "Past 6 months",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(to.getMonth() - 6);
      return [from, to];
    },
  },
  {
    label: "Past year",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setFullYear(to.getFullYear() - 1);
      return [from, to];
    },
  },
  {
    label: "Past 2 years",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setFullYear(to.getFullYear() - 2);
      return [from, to];
    },
  },
];

function getRangeLabel(range, selectedQuick) {
  if (selectedQuick === 0) return "All Time";
  if (selectedQuick !== null && selectedQuick !== undefined) {
    return QUICK_RANGES[selectedQuick].label;
  }
  if (range[0] && range[1]) {
    return `${range[0].toLocaleDateString()} - ${range[1].toLocaleDateString()}`;
  }
  return "Select date range";
}

function FilterBar({ filter, setFilter, dateRange, setDateRange }) {
  // Default to All Time
  const defaultIdx = 0;
  const [range, setRange] = useState([null, null]);
  const [selectedQuick, setSelectedQuick] = useState(defaultIdx);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [startDate, endDate] = range;

  // Ensure 'All Time' is truly active on first load
  useEffect(() => {
    if (dateRange !== "all") {
      setDateRange("all");
    }
    // eslint-disable-next-line
  }, []);

  const handleQuickRange = (getRange, idx) => {
    if (idx === 0) {
      setRange([null, null]);
      setDateRange('all');
      setSelectedQuick(idx);
      setFilterPanelOpen(false);
      return;
    }
    const result = getRange();
    setRange(result);
    setDateRange({ from: result[0], to: result[1] });
    setSelectedQuick(idx);
    setFilterPanelOpen(false);
  };

  const handleCalendarChange = (update) => {
    setRange(update);
    setSelectedQuick(null);
    if (update[0] && update[1]) {
      setDateRange({ from: update[0], to: update[1] });
      setFilterPanelOpen(false);
    }
  };

  // Overlay style for the filter panel
  const overlayStyle = {
    position: "fixed",
    top: 80, // adjust as needed for your header
    left: 0,
    width: "100vw",
    background: "rgba(0,0,0,0.08)",
    zIndex: 1000,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  };

  return (
    <>
      <div
        className="filter-bar"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 32,
          position: "relative",
          zIndex: 1010,
        }}
      >
        <div>
          {!filterPanelOpen && (
            <button
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                background: '#fff',
                fontWeight: 500,
                fontSize: 16,
                minWidth: 220,
                margin: '16px 0',
                boxShadow: '0 2px 16px #0001',
                cursor: filter === 'upcoming' ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                opacity: filter === 'upcoming' ? 0.5 : 1,
              }}
              onClick={() => {
                if (filter !== 'upcoming') {
                  setFilterPanelOpen(true);
                }
              }}
              disabled={filter === 'upcoming'}
            >
              <i className="fa fa-calendar" style={{ marginRight: 8 }} />
              {getRangeLabel(range, selectedQuick)}
              <span style={{ float: 'right', color: '#888', fontSize: 18, marginLeft: 8 }}>▼</span>
            </button>
          )}
          {filter === 'upcoming' && (
            <div style={{ color: '#b8860b', fontSize: 13, marginTop: 4 }}>
              Time filter is disabled for upcoming launches
            </div>
          )}
          {filterPanelOpen && (
            <div style={overlayStyle} onClick={() => setFilterPanelOpen(false)}>
              <div
                style={{
                  display: "flex",
                  background: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                  boxShadow: "0 2px 16px #0001",
                  minWidth: 600,
                  margin: "16px 0",
                  padding: 0,
                  zIndex: 1011,
                  position: "relative",
                  maxHeight: "80vh",
                  overflow: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    borderRight: "1px solid #eee",
                    padding: 24,
                    minWidth: 160,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    justifyContent: "center",
                  }}
                >
                  {QUICK_RANGES.map((r, idx) => (
                    <button
                      key={r.label}
                      onClick={() => handleQuickRange(r.getRange, idx)}
                      style={{
                        background: selectedQuick === idx ? "#e6f0ff" : "none",
                        border: "none",
                        textAlign: "left",
                        fontSize: 16,
                        color: "#222",
                        padding: "6px 0",
                        cursor: "pointer",
                        fontWeight: selectedQuick === idx ? 600 : 400,
                        borderRadius: 6,
                        transition: "background 0.2s",
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <div style={{ padding: 24 }}>
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleCalendarChange}
                    inline
                    monthsShown={2}
                    calendarClassName="custom-datepicker"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <i className="fa fa-filter" style={{ marginRight: 8 }} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Launches</option>
            <option value="upcoming">Upcoming Launches</option>
            <option value="success">Successful Launches</option>
            <option value="failed">Failed Launches</option>
          </select>
        </div>
        <style>{`
          .custom-datepicker {
            font-family: inherit;
            border: none;
            box-shadow: none;
          }
          .custom-datepicker .react-datepicker__month-container {
            margin: 0 8px;
          }
          .custom-datepicker .react-datepicker__header {
            background: #fff;
            border-bottom: 1px solid #eee;
          }
          .custom-datepicker .react-datepicker__day--selected,
          .custom-datepicker .react-datepicker__day--in-range {
            background: #e6f0ff;
            color: #0056b3;
          }
          .custom-datepicker .react-datepicker__day--range-start,
          .custom-datepicker .react-datepicker__day--range-end {
            background: #0056b3;
            color: #fff;
          }
          .custom-datepicker .react-datepicker__day {
            border-radius: 0;
          }
          .custom-datepicker .react-datepicker__day--range-start,
          .custom-datepicker .react-datepicker__day--range-end {
            border-radius: 50%;
          }
        `}</style>
      </div>
    </>
  );
}

export default FilterBar;
