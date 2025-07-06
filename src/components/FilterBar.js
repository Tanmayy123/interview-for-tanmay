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

function FilterBar({ filter, setFilter, dateRange, setDateRange, mobileOpen, setMobileOpen }) {
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

  // Close mobile filter when filter is applied
  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [dateRange, filter, mobileOpen, setMobileOpen]);

  // Smooth scroll to table when filter is applied
  const scrollToTable = () => {
    setTimeout(() => {
      const tableContainer = document.querySelector('.table-container');
      if (tableContainer) {
        tableContainer.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100); // Small delay to ensure filter is applied
  };

  const handleQuickRange = (getRange, idx) => {
    if (idx === 0) {
      setRange([null, null]);
      setDateRange('all');
      setSelectedQuick(idx);
      setFilterPanelOpen(false);
      scrollToTable();
      return;
    }
    const result = getRange();
    setRange(result);
    setDateRange({ from: result[0], to: result[1] });
    setSelectedQuick(idx);
    setFilterPanelOpen(false);
    scrollToTable();
  };

  const handleCalendarChange = (update) => {
    setRange(update);
    setSelectedQuick(null);
    if (update[0] && update[1]) {
      setDateRange({ from: update[0], to: update[1] });
      setFilterPanelOpen(false);
      scrollToTable();
    }
  };

  // Overlay style for the filter panel with responsive design
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
    animation: "fadeIn 0.3s ease", // Smooth animation
  };

  return (
    <>
      <div
        className={`filter-bar ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 32,
          position: "relative",
          zIndex: 1010,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <div className="filter-controls-group">
          {/* Filter Dropdowns and Quick Range Button */}
          <div
            className="filter-controls-row"
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '56px',
              width: '100%',
            }}
          >
            {!filterPanelOpen && (
              <button
                className="filter-dropdown-btn"
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  background: '#fff',
                  fontWeight: 500,
                  fontSize: 16,
                  width: '100%',
                  margin: '0 0 16px 0',
                  boxShadow: '0 2px 16px #0001',
                  cursor: filter === 'upcoming' ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  opacity: filter === 'upcoming' ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  display: 'block',
                }}
                onClick={() => {
                  if (filter !== 'upcoming') {
                    setFilterPanelOpen(true);
                  }
                }}
                onMouseEnter={(e) => {
                  if (filter !== 'upcoming') {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 20px #0002';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== 'upcoming') {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 16px #0001';
                  }
                }}
                disabled={filter === 'upcoming'}
              >
                <i className="fa fa-calendar" style={{ marginRight: 8 }} />
                {getRangeLabel(range, selectedQuick)}
                <span style={{ float: 'right', color: '#888', fontSize: 18, marginLeft: 8 }}>▼</span>
              </button>
            )}
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="filter-select"
              style={{
                width: '100%',
                padding: '10px 18px',
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                fontSize: 16,
                margin: '0 0 16px 0',
                boxSizing: 'border-box',
                display: 'block',
              }}
            >
              <option value="all">All Launches</option>
              <option value="upcoming">Upcoming</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          {/* End Filter Dropdowns and Quick Range Button */}
          {filter === 'upcoming' && (
            <div style={{ color: '#b8860b', fontSize: 13, marginTop: 4 }}>
              Time filter is disabled for upcoming launches
            </div>
          )}
          {filterPanelOpen && (
            <div style={overlayStyle} onClick={() => setFilterPanelOpen(false)}>
              <div
                className="filter-panel-mobile quick-ranges-desktop"
                style={{
                  display: "flex",
                  background: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                  boxShadow: "0 2px 16px #0001",
                  minWidth: 220,
                  maxWidth: 320,
                  width: '100%',
                  margin: "16px 0",
                  padding: 0,
                  zIndex: 1011,
                  position: "relative",
                  maxHeight: "80vh",
                  overflow: "auto",
                  animation: "slideIn 0.3s ease", // Smooth animation
                  transformOrigin: "top center",
                  boxSizing: 'border-box',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="quick-ranges-mobile quick-ranges-desktop"
                  style={{
                    padding: 24,
                    minWidth: 220,
                    maxWidth: 320,
                    width: '100%',
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {QUICK_RANGES.map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickRange(range.getRange, idx)}
                      className={`quick-range-btn-mobile quick-range-btn-desktop${selectedQuick === idx ? ' selected' : ''}`}
                      style={{
                        padding: "14px 0",
                        border: "none",
                        background: selectedQuick === idx ? "#007bff" : "#f7f8fa",
                        color: selectedQuick === idx ? "#fff" : "#222",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 16,
                        fontWeight: 500,
                        textAlign: "center",
                        width: "100%",
                        minWidth: 180,
                        maxWidth: 260,
                        margin: "0 auto",
                        boxShadow: selectedQuick === idx ? "0 2px 8px #007bff22" : "none",
                        transition: "all 0.2s ease",
                        letterSpacing: 0.01,
                        outline: selectedQuick === idx ? "2px solid #0056b3" : "none",
                        boxSizing: "border-box",
                        display: "block",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedQuick !== idx) {
                          e.target.style.background = "#e6eaf3";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedQuick !== idx) {
                          e.target.style.background = "#f7f8fa";
                        }
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                <div style={{ padding: 24, flex: 1 }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 600 }}>
                    Custom Date Range
                  </h3>
                  <DatePicker
                    selected={startDate}
                    onChange={handleCalendarChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    monthsShown={2}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="custom-datepicker"
                    calendarClassName="custom-datepicker"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .filter-controls-group {
          width: 100%;
          max-width: 540px;
          margin: 0;
          padding: 0 12px;
          box-sizing: border-box;
        }
        .filter-controls-row {
          display: flex;
          flex-direction: row;
          gap: 56px;
          width: 100%;
        }
        .filter-dropdown-btn, .filter-select {
          width: 240px;
          min-width: 180px;
          max-width: 260px;
          margin: 0 0 16px 0;
          box-sizing: border-box;
          display: block;
        }
        @media (max-width: 700px) {
          .filter-controls-group {
            width: 100%;
            max-width: 100vw;
            padding: 0 8px;
          }
          .filter-controls-row {
            flex-direction: column;
            gap: 0;
            width: 100%;
          }
          .filter-dropdown-btn, .filter-select {
            width: 100%;
            min-width: 0;
            max-width: none;
            margin: 0 0 16px 0;
          }
          .dark-mode-btn {
            top: 12px !important;
            right: 12px !important;
            padding: 8px 14px !important;
            font-size: 14px !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (min-width: 701px) {
          .quick-ranges-desktop {
            min-width: 220px !important;
            max-width: 320px !important;
            width: 100% !important;
            align-items: center !important;
            margin: 0 auto !important;
            gap: 16px !important;
          }
          .quick-range-btn-desktop {
            width: 100% !important;
            min-width: 180px !important;
            max-width: 260px !important;
            margin: 0 auto 8px auto !important;
            font-size: 16px !important;
            padding: 14px 0 !important;
            border-radius: 8px !important;
            box-sizing: border-box !important;
            display: block !important;
          }
        }
        @media (max-width: 700px) {
          .filter-panel-mobile {
            min-width: 0 !important;
            width: 96vw !important;
            margin: 8px 2vw !important;
            padding: 0 2vw 16px 2vw !important;
            border-radius: 14px !important;
            box-shadow: 0 4px 24px #0002 !important;
          }
          .quick-ranges-mobile {
            border-right: none !important;
            border-bottom: 1px solid #eee !important;
            padding: 16px 0 8px 0 !important;
            min-width: 0 !important;
            width: 100% !important;
            gap: 10px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .quick-range-btn-mobile {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            margin: 0 0 10px 0 !important;
            padding: 14px 0 !important;
            font-size: 16px !important;
            border-radius: 8px !important;
            box-shadow: none !important;
            background: #f7f8fa !important;
            color: #222 !important;
            border: none !important;
            text-align: center !important;
            font-weight: 500 !important;
            letter-spacing: 0.01em !important;
            transition: all 0.2s ease !important;
            box-sizing: border-box !important;
            display: block !important;
          }
          .quick-range-btn-mobile.selected,
          .quick-range-btn-mobile:active {
            background: #007bff !important;
            color: #fff !important;
            outline: 2px solid #0056b3 !important;
          }
        }
      `}</style>
    </>
  );
}

export default FilterBar;
