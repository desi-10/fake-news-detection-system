import React from "react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";

const WhatToDoNext = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What to do next</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="bg-blue-100 p-2 rounded-full h-8 w-8 flex items-center justify-center text-blue-700">
              1
            </div>
            <div>
              <h4 className="font-medium">Verify with multiple sources</h4>
              <p className="text-muted-foreground">
                Check if other reputable news outlets are reporting the same
                information
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="bg-blue-100 p-2 rounded-full h-8 w-8 flex items-center justify-center text-blue-700">
              2
            </div>
            <div>
              <h4 className="font-medium">Check the date</h4>
              <p className="text-muted-foreground">
                Ensure the content is current and not outdated information being
                presented as new
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="bg-blue-100 p-2 rounded-full h-8 w-8 flex items-center justify-center text-blue-700">
              3
            </div>
            <div>
              <h4 className="font-medium">Research the author and source</h4>
              <p className="text-muted-foreground">
                Look into the credibility of who wrote the article and where it
                was published
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardAction>jhgfhjkl</CardAction>
    </Card>
  );
};

export default WhatToDoNext;
