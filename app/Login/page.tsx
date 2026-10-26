"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * The login page.
 *
 * The user pulls the cord of a hanging lamp. When the lamp is on, the
 * login card slides in. `lampOn` is the only state we need.
 */
export default function LoginPage() {
  const [lampOn, setLampOn] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090d] text-white">
      {/* The light that comes from the lamp */}
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-1000 ${
          lampOn
            ? "bg-[radial-gradient(ellipse_at_75%_45%,rgba(255,190,70,0.15),transparent_55%)]"
            : "bg-transparent"
        }`}
      />

      {/* BikeZone logo */}
      <Link
        href="/"
        className="absolute left-6 top-60 z-20 text-3xl font-black italic sm:left-100 sm:top-8"
      >
        <span className="text-red-500">BIKE</span>ZONE
      </Link>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center gap-8 px-5 pb-12 pt-24 md:flex-row md:gap-12 md:px-12 md:pt-12">
        {/* LEFT: the hanging lamp */}
        <section className="relative flex min-h-[340px] w-full flex-col items-center justify-center md:min-h-screen md:w-1/2">
          {/* The wire the lamp hangs on */}
          <div className="absolute left-1/2 top-[-100px] h-40 w-1 -translate-x-1/2 bg-gray-500 md:top-[-45px]  md:h-55" />

          {/* The lamp itself */}
          <div
            className={`relative z-10 mt-5 transition-all duration-500 ${
              lampOn ? "drop-shadow-[0_15px_45px_rgba(255,200,80,0.7)]" : ""
            }`}
          >
            <svg
              width="180"
              height="150"
              viewBox="0 0 180 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Top of the lamp */}
              <path d="M65 10 Q90 -2 115 10 L115 25 L65 25 Z" fill="#777" />
              {/* The shade — its colour depends on the lamp being on or off */}
              <path
                d="M20 80 Q90 5 160 80 L145 105 L35 105 Z"
                fill={lampOn ? "#F8D477" : "#34363C"}
                stroke={lampOn ? "#FFE9A8" : "#555860"}
                strokeWidth="3"
              />
              {/* The glowing bulb */}
              <ellipse
                cx="90"
                cy="82"
                rx="70"
                ry="9"
                fill={lampOn ? "#FFF3C4" : "#777"}
              />
              {/* The light that shines down */}
              {lampOn && (
                <path d="M40 100 L140 100 L175 145 L5 145 Z" fill="#FFD66B" opacity="0.12" />
              )}
            </svg>
          </div>

          {/* The cord you pull */}
          <button
            type="button"
            onClick={() => setLampOn((previous) => !previous)}
            aria-label={lampOn ? "Turn lamp off" : "Pull cord to turn lamp on"}
            className="group relative z-20 flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
          >
            <div className="h-16 w-0.5 bg-gray-400 transition-colors group-hover:bg-yellow-300" />
            <div
              className={`h-5 w-5 rounded-full border-2 border-gray-400 transition-all duration-300 group-hover:scale-125 ${
                lampOn
                  ? "border-yellow-200 bg-yellow-300 shadow-[0_0_20px_5px_rgba(255,220,100,0.5)]"
                  : "bg-gray-600"
              }`}
            />
            <span className="mt-3 text-xs uppercase tracking-[0.2em] text-gray-500 transition-colors group-hover:text-yellow-200">
              {lampOn ? "Pull to switch off" : "Pull the cord"}
            </span>
          </button>

          <p className="mt-6 max-w-xs text-center text-sm text-gray-500">
            {lampOn
              ? "Light up your next ride."
              : "Pull the cord to reveal your ride."}
          </p>
        </section>

        {/* RIGHT: the login form */}
        <section className="flex w-full items-center mr-8 justify-center md:min-h-screen md:w-1/2">
          <div
            aria-hidden={!lampOn}
            className={`w-full max-w-md transition-all duration-700 ${
              lampOn
                ? "translate-x-0 scale-100 opacity-100"
                : "pointer-events-none translate-x-16 scale-95 opacity-0"
            }`}
          >
            <div
              style={{
                backgroundImage: `
             linear-gradient(
             to bottom,
              rgba(8, 9, 13, 0.92) 0%,
               rgba(8, 9, 13, 0.65) 45%,
              rgba(8, 9, 13, 0.90) 100%
                   ),url('/bikes/Ninja Ride.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="relative mr-8 mb-5 w-full max-w-md overflow-hidden
              rounded-2xl border border-white/15 p-6
              shadow-2xl shadow-red-950/30 sm:p-9"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-500">
                Welcome to BikeZone
              </p>

              <h1 className="text-3xl font-black sm:text-4xl">
                Ready to <span className="text-red-500">Ride?</span>
              </h1>

              <p className="mb-8 mt-3 text-sm text-gray-400">
                Sign in to continue your journey.
              </p>

              <form
                onSubmit={(event) => {
                  // There is no real login yet — this is where you would
                  // call your authentication API.
                  event.preventDefault();
                  alert("Connect your Better Auth sign-in here.");
                }}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-600 py-3.5 font-bold transition hover:bg-red-500 active:scale-[0.98]"
                >
                  Sign In →
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-red-400 hover:text-red-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
