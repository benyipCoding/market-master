import React from "react";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-black h-full">
      <nav className="fixed top-0 h-12 bg-background/50 backdrop-blur z-50 w-full px-10 md:px-48 flex items-center border-b-[1px]">
        Logo
      </nav>
      {children}
    </div>
  );
};

export default HomeLayout;
