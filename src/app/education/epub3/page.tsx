"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function EPUB3Page() {
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Why EPUB 3 Matters: The Future of Digital Publishing</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              EPUB 3 represents a significant evolution in digital publishing, offering enhanced features and capabilities that make it the preferred format for modern ebooks. Understanding the benefits of upgrading from EPUB 2 to EPUB 3 is crucial for publishers, authors, and content creators who want to provide the best reading experience.
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is EPUB 3?</h2>
              <p className="text-gray-700 mb-4">
                EPUB 3 is the third major version of the EPUB standard, released in 2011. It builds upon EPUB 2 by incorporating HTML5, CSS3, and JavaScript, providing a more robust and feature-rich format for digital publications.
              </p>
              <p className="text-gray-700">
                Unlike EPUB 2 which was based on XHTML 1.1, EPUB 3 leverages modern web technologies to deliver richer, more interactive content while maintaining compatibility across reading systems.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-3">Key Benefits of EPUB 3</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Enhanced accessibility features
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Rich media support (audio, video)
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Interactive content and scripting
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Better navigation with EPUB Navigation Documents
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    MathML support for scientific content
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-amber-800 mb-3">Limitations of EPUB 2</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limited accessibility features
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    No native audio/video support
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Basic navigation with NCX only
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limited styling capabilities
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    No support for complex layouts
                  </li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Upgrade to EPUB 3?</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Enhanced Reader Experience</h3>
                  <p className="text-gray-700">
                    EPUB 3 files provide a richer, more engaging reading experience with support for multimedia, interactivity, and advanced typography. 
                    Readers can enjoy embedded audio narration, video content, and interactive elements that aren't possible in EPUB 2.
                  </p>
                </div>
                
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Improved Accessibility</h3>
                  <p className="text-gray-700">
                    EPUB 3 includes native support for accessibility features such as semantic markup, ARIA roles, and enhanced navigation. 
                    This ensures that content is accessible to readers with disabilities, meeting WCAG 2.0 AA standards and beyond.
                  </p>
                </div>
                
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Better Device Compatibility</h3>
                  <p className="text-gray-700">
                    Modern e-readers and reading apps are optimized for EPUB 3, providing better rendering, improved performance, and consistent 
                    presentation across different devices and platforms.
                  </p>
                </div>
                
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Future-Proofing Content</h3>
                  <p className="text-gray-700">
                    As the publishing industry continues to evolve, EPUB 3 ensures your content remains relevant and compatible with emerging 
                    technologies and standards. EPUB 2 is increasingly being deprecated by major retailers and platforms.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our EPUB 2 to EPUB 3 Conversion Service</h2>
              <p className="text-gray-700 mb-4">
                Our automated conversion process transforms your legacy EPUB 2 files into modern EPUB 3 format while preserving all content and structure.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What We Convert:</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      XHTML 1.1 to HTML5
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      NCX to Navigation Documents
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      CSS 2.1 to CSS3
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Preserved Elements:</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      All text content and images
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Table of contents structure
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Metadata and book information
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              {isClient && (
                <Link 
                  href="/dashboard" 
                  className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 text-lg"
                >
                  Convert Your EPUB 2 Files Now
                </Link>
              )}
              <p className="mt-4 text-gray-600">
                Start upgrading your digital publications to the modern EPUB 3 standard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}