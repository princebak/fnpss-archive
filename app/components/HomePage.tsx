"use client";

import { useRouter } from "next/navigation";
import React from "react";

const HomePage = () => {
  const router = useRouter();

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="bg-white">
      <div className="relative isolate" id="heroSectionWrapper">
        <div id="heroSection">
          <div className="mx-auto max-w-2xl py-16">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Bienvenu chez Fnpss.{" "}
                <a href="#" className="font-semibold text-indigo-600">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  voir plus <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Tous les fichiers FNPSS sont gérés ici
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                A partir de ce portail FNPSS, vous pouvez télécharger des
                fichiers, partager des fichiers et plus encore...
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  onClick={handleClick}
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Commencer
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Apprendre plus <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
