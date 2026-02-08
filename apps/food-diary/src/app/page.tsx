import React from "react";
import EntryOverview from "../components/EntryOverview";
import { Button } from "@repo/ui";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Food Diary App</h1>
      <Button type="button">Shared UI Button</Button>
      <EntryOverview />
    </div>
  );
};

export default HomePage;
