import React from "react";
import { Card, CardFooter } from "../ui/card";
import { CgSpinner } from "react-icons/cg";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="p-12">
        <CgSpinner className="animate-spin text-6xl mx-auto text-primary" />
        <CardFooter>Analyzing, please wait...</CardFooter>
      </Card>
    </div>
  );
};

export default Loader;
