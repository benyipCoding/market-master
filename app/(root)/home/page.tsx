import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Link href="/playground" className="text-xl hover:underline">
        Playground
      </Link>
    </div>
  );
};

export default Home;
