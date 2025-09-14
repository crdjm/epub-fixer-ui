"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AccessibilityPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">EPUB Accessibility: Creating Inclusive Digital Publications</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              Accessibility in digital publishing is not just a legal requirement or ethical obligation—it's a fundamental aspect of inclusive design that 
              ensures all readers, regardless of their abilities, can access and enjoy your content. Understanding EPUB accessibility and the role of tools 
              like DAISY ACE is crucial for modern publishers.
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why EPUB Accessibility Matters</h2>
              <p className="text-gray-700 mb-4">
                Accessible EPUB publications ensure that people with disabilities can read and interact with digital content using assistive technologies 
                such as screen readers, magnifiers, and alternative input devices. This includes readers with visual, auditory, motor, or cognitive impairments.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      ADA compliance in the US
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      EU Web Accessibility Directive
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Accessibility legislation worldwide
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Business Benefits</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Expanded market reach
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Improved SEO and discoverability
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Enhanced reading experience for all
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-3">Key Accessibility Principles</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">1</div>
                    <span><strong>Perceivable:</strong> Information and user interface components must be presentable to users in ways they can perceive</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">2</div>
                    <span><strong>Operable:</strong> User interface components and navigation must be operable by all users</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">3</div>
                    <span><strong>Understandable:</strong> Information and operation of the user interface must be understandable</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">4</div>
                    <span><strong>Robust:</strong> Content must be robust enough to be interpreted reliably by a wide variety of user agents</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-amber-800 mb-3">Common Accessibility Barriers</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">1</div>
                    <span>Images without alternative text descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">2</div>
                    <span>Poor color contrast making text difficult to read</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">3</div>
                    <span>Inconsistent or missing heading structure</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">4</div>
                    <span>Links without descriptive text</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">5</div>
                    <span>Missing document language specification</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">DAISY ACE: The Accessibility Checker for EPUB</h2>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 mb-4">
                  ACE (Accessibility Checker for EPUB) is a free, open-source tool developed by the DAISY Consortium that performs automated accessibility 
                  checks on EPUB publications. Unlike EPUBCheck which focuses on technical validation, ACE specifically evaluates accessibility compliance.
                </p>
                <p className="text-gray-700">
                  ACE integrates the power of Axe-core accessibility engine with EPUB-specific rules to identify potential accessibility issues and provide 
                  actionable feedback for content creators.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">How DAISY ACE Works</h3>
                  <p className="text-gray-700">
                    ACE analyzes EPUB files by examining content documents, navigation structures, and metadata to identify accessibility issues. It generates 
                    detailed reports that categorize issues by severity and provide guidance on how to resolve them.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Key Features of DAISY ACE</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Automated accessibility testing based on WCAG 2.0 AA standards</li>
                    <li>EPUB-specific accessibility rules and best practices</li>
                    <li>Detailed reporting with issue severity levels</li>
                    <li>Integration with content creation workflows</li>
                    <li>Support for both EPUB 2 and EPUB 3 formats</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Benefits of Using DAISY ACE</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Early identification of accessibility issues in the production process</li>
                    <li>Consistent evaluation against established accessibility standards</li>
                    <li>Reduced manual testing time and effort</li>
                    <li>Improved quality and compliance of published content</li>
                    <li>Enhanced user experience for readers with disabilities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Issues We Automatically Fix</h2>
              <p className="text-gray-700 mb-4">
                Our service automatically resolves common accessibility issues identified by DAISY ACE to ensure your publications are inclusive:
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">image-alt: Images missing alternative text</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding descriptive alt text to images</li>
                    <li>Adding empty alt text to decorative images</li>
                    <li>AI-powered alt text generation with Ollama or Gemini</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">html-has-lang: HTML documents missing language attributes</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding lang attribute to html element</li>
                    <li>Adding xml:lang attribute for XHTML documents</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">document-title: Documents missing title elements</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding meaningful title elements to documents</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">heading-order: Incorrect heading structure and hierarchy</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Fixing heading level gaps</li>
                    <li>Promoting first heading to h1</li>
                    <li>Adding missing headings</li>
                    <li>Converting emphasized text to headings</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">empty-heading: Headings with no visible text</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding text content to empty headings</li>
                    <li>Adding aria-label attributes</li>
                    <li>Removing unnecessary empty headings</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">link-name: Links without discernible text</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding descriptive text to links</li>
                    <li>Adding aria-label attributes</li>
                    <li>Adding title attributes</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">link-in-text-block: Links not distinguishable from surrounding text</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding underline styling to links</li>
                    <li>Improving color contrast</li>
                    <li>Adding title attributes for context</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">color-contrast: Insufficient color contrast</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adjusting text colors for better contrast</li>
                    <li>Adding background colors to improve contrast</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">epub-type-has-matching-role: EPUB type attributes without matching ARIA roles</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding appropriate ARIA role attributes</li>
                    <li>Mapping epub:type to ARIA roles</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">OPF-096: Non-linear content not reachable</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding navigation links to non-linear content</li>
                    <li>Creating accessibility sections for non-linear items</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">landmark-unique: Landmark elements without unique accessible names</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding unique aria-label attributes</li>
                    <li>Adding unique title attributes</li>
                    <li>Ensuring landmark elements have distinguishable names</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">metadata-*: Missing accessibility metadata</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Adding schema:accessMode metadata</li>
                    <li>Adding schema:accessModeSufficient metadata</li>
                    <li>Adding schema:accessibilityFeature metadata</li>
                    <li>Adding schema:accessibilityHazard metadata</li>
                    <li>Adding schema:accessibilitySummary metadata</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-blue-800">
                  <strong>Note:</strong> These fixes are applied automatically when running our tool in fix mode. AI-powered alt text generation is available using the --use-gemini flag to use Gemini AI instead of Ollama.
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices for Accessible EPUB Creation</h2>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Content Structure</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Use proper heading hierarchy (H1-H6)
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Provide alternative text for all informative images
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Use semantic HTML elements appropriately
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Navigation and Usability</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Ensure consistent navigation across chapters
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Provide skip links for keyboard users
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Ensure sufficient color contrast (4.5:1 minimum)
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
                  Make Your EPUBs Accessible Now
                </Link>
              )}
              <p className="mt-4 text-gray-600">
                Ensure your publications are inclusive and accessible to all readers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}