"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function EPUBCheckPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            EPUBCheck: Ensuring EPUB Compliance and Quality
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              EPUBCheck is the official conformance checker for EPUB
              publications, developed and maintained by the DAISY Consortium and
              adopted by the W3C. Understanding EPUBCheck and its role in
              validating your EPUB files is essential for producing
              high-quality, compliant digital publications.
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What is EPUBCheck?
              </h2>
              <p className="text-gray-700 mb-4">
                EPUBCheck is a free, open-source command-line tool that
                validates EPUB files against the EPUB specification. It checks
                for structural, semantic, and technical errors that could
                prevent your publications from rendering correctly across
                different reading systems.
              </p>
              <p className="text-gray-700">
                The tool identifies issues ranging from simple packaging errors
                to complex structural problems, ensuring your EPUB files meet
                industry standards and are compatible with major e-reading
                platforms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-3">
                  Types of Issues EPUBCheck Detects
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      1
                    </div>
                    <span>
                      <strong>Structural Errors:</strong> Issues with the
                      package structure, container, or file organization
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      2
                    </div>
                    <span>
                      <strong>Metadata Problems:</strong> Missing or invalid
                      metadata elements in the OPF file
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      3
                    </div>
                    <span>
                      <strong>Navigation Issues:</strong> Problems with the
                      table of contents or navigation documents
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      4
                    </div>
                    <span>
                      <strong>Content Validation:</strong> HTML, CSS, and XML
                      syntax errors in content documents
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      5
                    </div>
                    <span>
                      <strong>Accessibility Concerns:</strong> Issues that
                      affect accessibility compliance
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-amber-800 mb-3">
                  Consequences of EPUBCheck Errors
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      1
                    </div>
                    <span>
                      <strong>Rejection by Retailers:</strong> Major platforms
                      like Apple Books, Google Play, and Kobo may reject
                      non-compliant files
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      2
                    </div>
                    <span>
                      <strong>Rendering Issues:</strong> Files may not display
                      correctly or consistently across different reading systems
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      3
                    </div>
                    <span>
                      <strong>User Experience Problems:</strong> Readers may
                      encounter broken links, missing images, or navigation
                      failures
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      4
                    </div>
                    <span>
                      <strong>Legal and Compliance Risks:</strong>{" "}
                      Non-compliance with accessibility standards may have legal
                      implications
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                EPUBCheck Validation Process
              </h2>

              <div className="space-y-6">
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Package Validation
                  </h3>
                  <p className="text-gray-700">
                    EPUBCheck first examines the package structure, ensuring the
                    container.xml file is correctly formatted and all required
                    files are present. It validates the OPF file for proper
                    metadata, manifest, and spine elements.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Content Document Validation
                  </h3>
                  <p className="text-gray-700">
                    Each XHTML content document is checked for valid HTML5
                    markup, proper use of EPUB-specific elements, and adherence
                    to the EPUB Content Documents specification. CSS files are
                    also validated for compliance.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Navigation Validation
                  </h3>
                  <p className="text-gray-700">
                    The EPUB Navigation Document (nav.xhtml) is validated to
                    ensure proper structure and accessibility. EPUBCheck checks
                    for correct use of navigation elements and landmarks.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Accessibility Checks
                  </h3>
                  <p className="text-gray-700">
                    EPUBCheck performs basic accessibility checks, identifying
                    issues that could prevent users with disabilities from
                    accessing content. These checks complement more
                    comprehensive tools like DAISY ACE.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                EPUBCheck Issues We Automatically Fix
              </h2>
              <p className="text-gray-700 mb-4">
                Our service automatically resolves common EPUBCheck errors to
                ensure your publications meet industry standards:
              </p>

              <div className="mt-6 space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    RSC-005: Structural validation errors including invalid
                    attributes
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Invalid http-equiv attributes in meta tags</li>
                    <li>Invalid role attributes</li>
                    <li>Invalid xsi:type attributes</li>
                    <li>Invalid opf:role attributes</li>
                    <li>Page-map attributes not allowed</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    OPF-014: Missing remote-resources property for remote
                    resource references
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>
                      Adding remote-resources property to OPF manifest items
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    OPF-073: DOCTYPE external identifiers issues
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>
                      Removing external identifiers from DOCTYPE declarations
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    dcterms:modified: Invalid dcterms:modified timestamp format
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>
                      Converting timestamps to valid EPUB format
                      (CCYY-MM-DDThh:mm:ssZ)
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    dc:date: Multiple dc:date elements or invalid positioning
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Consolidating multiple dc:date elements</li>
                    <li>Repositioning dc:date elements in metadata</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    spine element toc attribute: Missing toc attribute in spine
                    element
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding toc attribute pointing to NCX file</li>
                    <li>Generating ID for NCX item if missing</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-blue-800">
                  <strong>Note:</strong> These fixes are applied automatically
                  when running our tool in fix mode, ensuring your EPUB files
                  pass EPUBCheck validation.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              {isClient && (
                <Link
                  href="/dashboard"
                  className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 text-lg"
                >
                  Validate and Fix Your EPUB Files Now
                </Link>
              )}
              <p className="mt-4 text-gray-600">
                Ensure your publications meet industry standards with our
                automated EPUBCheck validation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
