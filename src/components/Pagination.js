import React from "react";

function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="pagination">
      <button onClick={() => setPage(1)} disabled={page === 1}>
        {"<"}
      </button>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        {"<"}
      </button>
      <span style={{ margin: "0 8px" }}>
        {page} / {totalPages}
      </span>
      <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
        {">"}
      </button>
      <button
        onClick={() => setPage(totalPages)}
        disabled={page === totalPages}
      >
        {">"}
      </button>
    </div>
  );
}

export default Pagination;
