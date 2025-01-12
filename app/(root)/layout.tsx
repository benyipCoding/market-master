import React from "react";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-black h-full relative">
      <nav className="absolute top-0 h-12 bg-zinc-950/50 backdrop-blur z-50 w-full px-10 md:px-40 flex items-center">
        Logo
      </nav>
      {children}
    </div>
  );
};

export default HomeLayout;
