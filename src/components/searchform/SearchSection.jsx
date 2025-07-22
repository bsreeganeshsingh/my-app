import React from "react";
import SearchForm from "./SearchForm";
import { Outlet, useOutletContext } from "react-router-dom";

function SearchSection() {
  const outletContext = useOutletContext() || {};
  const { handleSearch = () => {} } = outletContext;

  return (
    <>
      <SearchForm initialQuery="" onSearch={handleSearch} />
      <Outlet />
    </>
  );
}

export default SearchSection;
