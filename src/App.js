import React, { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader";
import FilterBar from "./components/FilterBar";
import LaunchTable from "./components/LaunchTable";
import Pagination from "./components/Pagination";
import LaunchModal from "./components/LaunchModal";
import {
  fetchAllLaunches,
  fetchPastLaunches,
  fetchUpcomingLaunches,
} from "./api/spacex";
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PER_PAGE = 12;

function App() {
  const [launches, setLaunches] = useState([]);
  const [payloads, setPayloads] = useState({});
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("1m");
  const [customRange, setCustomRange] = useState([null, null]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedLaunch, setSelectedLaunch] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Fetch all launch data from different endpoints
    Promise.all([
      fetchAllLaunches(),
      fetchPastLaunches(),
      fetchUpcomingLaunches()
    ]).then(([allLaunches, pastLaunchesData, upcomingLaunchesData]) => {
      console.log("=== ALL LAUNCHES API DATA ===");
      console.log("Total launches:", allLaunches.length);
      console.log("Sample launch data:", allLaunches[0]);
      console.log("All launches:", allLaunches);
      
      console.log("=== PAST LAUNCHES API DATA ===");
      console.log("Total past launches:", pastLaunchesData.length);
      console.log("Sample past launch:", pastLaunchesData[0]);
      console.log("All past launches:", pastLaunchesData);
      
      console.log("=== UPCOMING LAUNCHES API DATA ===");
      console.log("Total upcoming launches:", upcomingLaunchesData.length);
      console.log("Sample upcoming launch:", upcomingLaunchesData[0]);
      console.log("All upcoming launches:", upcomingLaunchesData);
      
      // Combine all launches and remove duplicates based on id
      const allLaunchesMap = new Map();
      
      // Add all launches to the map (this will automatically handle duplicates)
      [...allLaunches, ...pastLaunchesData, ...upcomingLaunchesData].forEach(launch => {
        if (launch.id) {
          allLaunchesMap.set(launch.id, launch);
        }
      });
      
      const combinedLaunches = Array.from(allLaunchesMap.values());
      
      console.log("=== COMBINED LAUNCHES ===");
      console.log("Combined total launches:", combinedLaunches.length);
      console.log("Combined launches:", combinedLaunches);
      
      // Debug: Show date ranges of launches
      const sortedLaunches = combinedLaunches.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
      console.log("=== DATE RANGE DEBUG ===");
      console.log("Most recent launch:", sortedLaunches[0]?.date_utc, sortedLaunches[0]?.name);
      console.log("Oldest launch:", sortedLaunches[sortedLaunches.length - 1]?.date_utc, sortedLaunches[sortedLaunches.length - 1]?.name);
      
      // Show the 5 most recent launches
      console.log("=== 5 MOST RECENT LAUNCHES ===");
      sortedLaunches.slice(0, 5).forEach((launch, index) => {
        console.log(`${index + 1}. ${launch.name} - ${launch.date_utc} (${new Date(launch.date_utc).toLocaleDateString()})`);
      });
      
      // Debug upcoming launches
      const upcomingLaunches = combinedLaunches.filter(launch => launch.upcoming);
      const pastLaunches = combinedLaunches.filter(launch => !launch.upcoming);
      console.log("=== UPCOMING VS PAST DEBUG ===");
      console.log("Upcoming launches count:", upcomingLaunches.length);
      console.log("Past launches count:", pastLaunches.length);
      console.log("Sample upcoming launch:", upcomingLaunches[0]);
      console.log("Sample past launch:", pastLaunches[0]);
      
      // Show launches from last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentLaunches = sortedLaunches.filter(launch => {
        const launchDate = new Date(launch.date_utc);
        return launchDate >= oneWeekAgo;
      });
      console.log("Launches in last 7 days:", recentLaunches.length);
      console.log("Recent launches:", recentLaunches);
      
      // Show launches from last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const sixMonthLaunches = sortedLaunches.filter(launch => {
        const launchDate = new Date(launch.date_utc);
        return launchDate >= sixMonthsAgo;
      });
      console.log("Launches in last 6 months:", sixMonthLaunches.length);
      console.log("6-month launches:", sixMonthLaunches);
      
      let filtered = combinedLaunches;
      
      // Apply status filter (upcoming, success, failed)
      if (filter === 'upcoming') {
        filtered = filtered.filter(launch => launch.upcoming);
      } else if (filter === 'success') {
        filtered = filtered.filter(launch => launch.success && !launch.upcoming);
      } else if (filter === 'failed') {
        filtered = filtered.filter(launch => !launch.success && !launch.upcoming);
      }
      // 'all' filter shows everything (no additional filtering needed)
      
      // Apply date range filter
      if (dateRange !== 'all') {
        if (typeof dateRange === 'object' && dateRange.from && dateRange.to) {
          // Custom or quick range as object
          filtered = filtered.filter(launch => {
            const launchDate = new Date(launch.date_utc);
            return launchDate >= dateRange.from && launchDate <= dateRange.to;
          });
        } else {
          const now = new Date();
          let startDate = new Date();
          switch (dateRange) {
            case '1w':
              startDate.setDate(now.getDate() - 7);
              break;
            case '1m':
              startDate.setMonth(now.getMonth() - 1);
              break;
            case '3m':
              startDate.setMonth(now.getMonth() - 3);
              break;
            case '6m':
              startDate.setMonth(now.getMonth() - 6);
              break;
            case '1y':
              startDate.setFullYear(now.getFullYear() - 1);
              break;
            case '2y':
              startDate.setFullYear(now.getFullYear() - 2);
              break;
            default:
              break;
          }
          if (filter !== 'upcoming') {
            filtered = filtered.filter(launch => {
              const launchDate = new Date(launch.date_utc);
              return launchDate >= startDate;
            });
          } else {
            // For upcoming launches, show all upcoming (time range is disabled)
          }
        }
      }
      
      console.log("=== FILTERED LAUNCHES ===");
      console.log("Filter:", filter);
      console.log("Date Range:", dateRange);
      console.log("Filtered launches count:", filtered.length);
      console.log("Filtered launches:", filtered);
      
      // Debug: Show breakdown by status
      const successfulLaunches = filtered.filter(launch => launch.success && !launch.upcoming);
      const failedLaunches = filtered.filter(launch => !launch.success && !launch.upcoming);
      const upcomingLaunchesFiltered = filtered.filter(launch => launch.upcoming);
      
      console.log("=== FILTER BREAKDOWN ===");
      console.log("Successful launches in filtered results:", successfulLaunches.length);
      console.log("Failed launches in filtered results:", failedLaunches.length);
      console.log("Upcoming launches in filtered results:", upcomingLaunchesFiltered.length);
      
      setLaunches(filtered);
      setLoading(false);
      setPage(1);
      if (filtered.length === 0) {
        toast.info('No launches found for the selected filter.');
      }
    }).catch((error) => {
      toast.error('Failed to fetch launches. Please try again later.');
      setLoading(false);
    });

    // Fetch payloads
    fetch('https://api.spacexdata.com/v4/payloads')
      .then(res => res.json())
      .then(data => {
        console.log("=== PAYLOADS API DATA ===");
        console.log("Total payloads:", data.length);
        console.log("Sample payload:", data[0]);
        console.log("All payloads:", data);
        
        const map = {};
        data.forEach(payload => {
          map[payload.id] = payload;
        });
        setPayloads(map);
      })
      .catch(error => {
        console.error("Error fetching payloads:", error);
      });
  }, [filter, dateRange]);

  const totalPages = Math.ceil(launches.length / PER_PAGE);

  return (
    <div className="app-bg">
      <AppHeader />
      <main className="main-content">
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          customRange={customRange}
          setCustomRange={setCustomRange}
        />
        <div 
          className="table-container" 
          onClick={() => {
            console.log("=== CURRENTLY DISPLAYED DATA ===");
            console.log("Total launches in state:", launches.length);
            console.log("Current page:", page);
            console.log("Per page:", PER_PAGE);
            console.log("Total pages:", totalPages);
            console.log("Launches being displayed:", launches.slice((page - 1) * PER_PAGE, page * PER_PAGE));
            console.log("All launches in state:", launches);
          }}
          style={{ cursor: 'pointer' }}
        >
          {loading ? (
            <div className="loading">Loading launches...</div>
          ) : (
            <>
              <LaunchTable
                launches={launches}
                payloads={payloads}
                page={page}
                perPage={PER_PAGE}
                onRowClick={setSelectedLaunch}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </>
          )}
        </div>
        <LaunchModal
          launch={selectedLaunch}
          onClose={() => setSelectedLaunch(null)}
        />
        <ToastContainer position="top-right" autoClose={2000} />
      </main>
    </div>
  );
}

export default App;
