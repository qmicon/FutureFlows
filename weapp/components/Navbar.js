import { fclConfig } from "@/flow/config";
import * as fcl from "@onflow/fcl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

fclConfig()

function Navbar() {
    const router = useRouter();
    const {data: session} = useSession()
    const [user, setUser] = useState({loggedIn: null})
    useEffect(() => fcl.currentUser.subscribe(setUser), [])
    const AuthedState = () => {
      return (
        <div>
          <div>Address: {user?.addr ?? "No Address"}</div>
          <button onClick={fcl.unauthenticate}>Log Out</button>
        </div>
      )
    }
  
    const UnauthenticatedState = () => {
      return (
        <div style = {{   display: "flex",justifyContent: "space-between"}}>
          <button style={{padding: "16px"}} onClick={fcl.logIn}>Log In</button>
          <button onClick={fcl.signUp}>Sign Up</button>
        </div>
      )
    }
  
    return (
      <>
        <nav className="w-full h-16 mt-auto max-w-5xl">
          <div className="flex flex-row justify-between items-center h-full">
            <Link href="/" passHref>
              <span className="font-semibold text-xl cursor-pointer">
                FutureFLows
              </span>
            </Link>
            {!router.asPath.includes("/market") &&
              !router.asPath.includes("/admin") && (
                <div className="flex flex-row items-center justify-center h-full">
                  <TabButton
                    title="Market"
                    isActive={router.asPath === "/"}
                    url={"/"}
                  />
                  <TabButton
                    title="Portfolio"
                    isActive={router.asPath === "/portfolio"}
                    url={"/portfolio"}
                  />
                  <TabButton
                    title="Payment Page"
                    isActive={router.asPath === "/payment"}
                    url={"/payment"}
                  />
                </div>
              )}
            {session && session.user ? (
              <div>
                <span className="text-lg text-white">
                  {session.user?.address.substr(0, 10)}...
                </span>
              </div>
            ) : (
              <div
              >
                          {user.loggedIn
                  ? <AuthedState />
                  : <UnauthenticatedState />
                }
              </div>
            )}
          </div>
        </nav>
      </>
    );
  }
  
  export default Navbar;

  const TabButton = ({
    title,
    isActive,
    url,
  }) => {
    return (
      <Link href={url} passHref>
        <div
          className={`h-full px-4 flex items-center border-b-2 font-semibold hover:border-blue-700 hover:text-blue-700 cursor-pointer ${
            isActive
              ? "border-blue-700 text-blue-700 text-lg font-semibold"
              : "border-white text-gray-400 text-lg"
          }`}
        >
          <span>{title}</span>
        </div>
      </Link>
    );
  };
  