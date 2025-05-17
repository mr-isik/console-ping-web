import React from "react";

const CenterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      {children}
    </main>
  );
};

export default CenterLayout;
