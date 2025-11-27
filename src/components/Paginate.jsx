import React from "react";
import ReactPaginate from "react-paginate";
import styled from "styled-components"; // 1. Import thư viện

function Paginate({ pageCount, onPageChange }) {
  return (
    <PaginationWrapper>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={onPageChange}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        activeClassName="active"
        disabledClassName="disabled"
      />
    </PaginationWrapper>
  );
}

const PaginationWrapper = styled.div`
  ul {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 20px 0;
    justify-content: center;
    align-items: center;
    gap: 6px;
    user-select: none;
  }

  li {
    display: inline-flex;
  }

  li a {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background-color: #fff;
    color: #4a5568;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    text-decoration: none;

    &:hover {
      background-color: #edf2f7;
      border-color: #cbd5e0;
      color: #2d3748;
    }
  }

  li.active a {
    background-color: #3182ce;
    border-color: #3182ce;
    color: #ffffff;
    font-weight: 600;

    &:hover {
      background-color: #2b6cb0;
    }
  }

  li.disabled a {
    background-color: #f7fafc;
    color: #cbd5e0;
    border-color: #edf2f7;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export default Paginate;
