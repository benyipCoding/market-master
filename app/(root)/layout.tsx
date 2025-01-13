import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-black h-full">
      <h1 className="sr-only">TradingCamp</h1>
      <nav className="fixed top-0 h-12 bg-background/30 backdrop-blur z-50 w-full px-10 md:px-48 flex items-center border-b-[1px]">
        <Image
          src={"/tc-high-resolution-logo-transparent.png"}
          alt="logo"
          width={50}
          height={50}
          className="cursor-pointer mr-16"
        />
        <NavigationMenu>
          <NavigationMenuList className="flex gap-12">
            <NavigationMenuItem>
              <Link href="/home" legacyBehavior passHref>
                <NavigationMenuLink>Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink>Dashboard</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/playground" legacyBehavior passHref>
                <NavigationMenuLink>Playground</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="fixed right-48">
              <Link href="/auth/login" legacyBehavior passHref>
                <NavigationMenuLink asChild>
                  <Button variant={"ghost"}>Sign In</Button>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      {children}
    </div>
  );
};

export default HomeLayout;
