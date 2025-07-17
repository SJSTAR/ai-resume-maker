import React, { useState, useRef } from 'react';

// --- Helper Icons ---
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const BrainCircuitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
        <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.1.38-1.98 1.03-2.65-.1-.25-.45-1.25.1-2.62 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33s1.7.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.37.1 2.62.65.67 1.03 1.55 1.03 2.65 0 3.82-2.34 4.66-4.57 4.91.36.31.68.92.68 1.85v2.72c0 .27.16.58.67.5A10 10 0 0 0 22 12a10 10 0 0 0-10-10z" />
    </svg>
);

const SparklesIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M10 2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm0 18a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75ZM18.25 10a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-.75-.75ZM5.75 10a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-.75-.75ZM16.5 6.53a.75.75 0 0 1 0-1.06l1.5-1.5a.75.75 0 0 1 1.06 1.06l-1.5 1.5a.75.75 0 0 1-1.06 0ZM6.03 17.97a.75.75 0 0 1 0-1.06l1.5-1.5a.75.75 0 1 1 1.06 1.06l-1.5 1.5a.75.75 0 0 1-1.06 0Zm1.5-12.5a.75.75 0 0 1 1.06 0l1.5 1.5a.75.75 0 1 1-1.06 1.06l-1.5-1.5a.75.75 0 0 1 0-1.06Zm9.94 9.94a.75.75 0 0 1 1.06 0l1.5 1.5a.75.75 0 1 1-1.06 1.06l-1.5-1.5a.75.75 0 0 1 0-1.06Z"/>
    </svg>
);


// --- Main App Component ---
export default function App() {
    const [prompt, setPrompt] = useState('');
    const [resumeData, setResumeData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isImproving, setIsImproving] = useState({ type: null, index: null });
    const resumePreviewRef = useRef(null);
    
    const defaultPrompt = `
    Generate a resume for Sahil Jaglan. 
    Contact: sahil.jaglan@example.com, 555-123-4567, linkedin.com/in/sjstar/, github.com/sahiljaglan.
    
    Summary: A highly motivated and results-oriented Software Engineer with over 5 years of experience in developing, testing, and maintaining web applications. Proficient in JavaScript, React, and Node.js. Seeking to leverage my skills to contribute to a dynamic engineering team.

    Experience:
    1. Senior Frontend Developer at Tech Solutions Inc., San Francisco, CA (June 2020 - Present).
       - Led the development of a new e-commerce platform using React and Redux, resulting in a 30% increase in user engagement.
       - Mentored junior developers and conducted code reviews to ensure high-quality code.
       - Collaborated with UX/UI designers to implement responsive and user-friendly interfaces.
    2. Software Engineer at Web Innovators LLC, Boston, MA (July 2017 - May 2020).
       - Developed and maintained client websites using JavaScript, HTML, and CSS.
       - Worked in an Agile environment, participating in daily stand-ups and sprint planning.

    Education:
    - Bachelor of Science in Computer Science, University of Technology (2013 - 2017).

    Skills: JavaScript, React, Node.js, Express, MongoDB, HTML, CSS, Git, Agile Methodologies.
    `;
    
    const handleGenerateResume = async () => {
        if (!prompt.trim()) {
            setError("Prompt cannot be empty. Please enter your resume details.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResumeData(null);

        const fullPrompt = `Based on the following information, generate a structured resume. Parse the details and return them as a JSON object. Ensure all fields in the schema are populated. If a piece of information (like github) is not provided, return an empty string for it. For descriptions, split sentences into a list of strings. \n\n${prompt}`;

        const chatHistory = [{ role: "user", parts: [{ text: fullPrompt }] }];

        const payload = {
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        name: { "type": "STRING" }, email: { "type": "STRING" }, phone: { "type": "STRING" },
                        linkedin: { "type": "STRING" }, github: { "type": "STRING" }, summary: { "type": "STRING" },
                        experience: {
                            "type": "ARRAY", "items": {
                                "type": "OBJECT", "properties": {
                                    title: { "type": "STRING" }, company: { "type": "STRING" }, location: { "type": "STRING" },
                                    dates: { "type": "STRING" },
                                    description: { "type": "ARRAY", "items": { "type": "STRING" } }
                                }, required: ["title", "company", "dates", "description"]
                            }
                        },
                        education: {
                            "type": "ARRAY", "items": {
                                "type": "OBJECT", "properties": {
                                    degree: { "type": "STRING" }, institution: { "type": "STRING" }, dates: { "type": "STRING" }
                                }, required: ["degree", "institution", "dates"]
                            }
                        },
                        skills: { "type": "ARRAY", "items": { "type": "STRING" } }
                    },
                    required: ["name", "email", "phone", "summary", "experience", "education", "skills"]
                }
            }
        };

        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { const errorBody = await response.text(); throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`); }
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const jsonText = result.candidates[0].content.parts[0].text;
                const parsedJson = JSON.parse(jsonText);
                setResumeData(parsedJson);
            } else {
                console.error("Unexpected API response structure:", result);
                let errorMessage = "AI failed to generate a valid resume structure.";
                if (result.promptFeedback?.blockReason) { errorMessage += ` Reason: ${result.promptFeedback.blockReason.reason}`; }
                throw new Error(errorMessage);
            }
        } catch (e) {
            console.error(e);
            setError(`An error occurred: ${e.message}.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImproveSection = async (type, data, index = null) => {
        setIsImproving({ type, index });
        let promptText = '';
        if (type === 'summary') {
            promptText = `Rewrite the following professional resume summary to be more impactful and concise. Do not add any introductory text, just provide the rewritten summary.\n\nOriginal Summary:\n"${data}"`;
        } else if (type === 'experience') {
            const descriptionText = data.join('\n- ');
            promptText = `Rewrite the following resume bullet points for a job description to be more professional and results-oriented. Use strong action verbs. Return only the rewritten bullet points, each on a new line starting with a hyphen. Do not add any other text.\n\nOriginal Bullet Points:\n- ${descriptionText}`;
        }

        const payload = { contents: [{ role: "user", parts: [{ text: promptText }] }] };

        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { const errorBody = await response.text(); throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`); }
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const improvedText = result.candidates[0].content.parts[0].text;
                setResumeData(currentData => {
                    const newData = JSON.parse(JSON.stringify(currentData));
                    if (type === 'summary') {
                        newData.summary = improvedText.trim();
                    } else if (type === 'experience' && index !== null) {
                        const newDescription = improvedText.split('\n').map(line => line.replace(/^- ?/, '').trim()).filter(line => line);
                        newData.experience[index].description = newDescription;
                    }
                    return newData;
                });
            } else {
                throw new Error('Failed to get a valid response from the AI.');
            }
        } catch (e) {
            console.error(e);
            setError(`Failed to improve section: ${e.message}`);
        } finally {
            setIsImproving({ type: null, index: null });
        }
    };

    const handleDownloadPdf = () => {
        // Check if the libraries are loaded and available on the window object
        if (typeof window.jspdf === 'undefined' || typeof window.html2canvas === 'undefined') {
            setError("PDF generation libraries are not ready. Please wait a moment and try again.");
            console.error("jsPDF or html2canvas not found on window object.", "window.jspdf:", window.jspdf, "window.html2canvas:", window.html2canvas);
            return;
        }

        // Correctly access the jsPDF constructor and html2canvas function
        const jsPDF = window.jspdf.jsPDF;
        const html2canvas = window.html2canvas;

        if (!resumePreviewRef.current) {
            setError("Resume preview is not available to download.");
            return;
        }

        setIsLoading(true);
        const input = resumePreviewRef.current;
        const a4Width = 595.28;
        const a4Height = 841.89;

        html2canvas(input, { scale: 2, useCORS: true, width: input.scrollWidth, height: input.scrollHeight })
        .then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            // Instantiate the jsPDF class
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            const canvasAspectRatio = canvas.width / canvas.height;
            let pdfImgWidth = a4Width;
            let pdfImgHeight = a4Width / canvasAspectRatio;
            if (pdfImgHeight > a4Height) {
                pdfImgHeight = a4Height;
                pdfImgWidth = a4Height * canvasAspectRatio;
            }
            const x = (a4Width - pdfImgWidth) / 2;
            pdf.addImage(imgData, 'PNG', x, 0, pdfImgWidth, pdfImgHeight);
            pdf.save(`${(resumeData?.name || 'resume').replace(/ /g, '_')}.pdf`);
        }).catch(err => {
            setError("Failed to generate PDF. " + err.message);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans text-gray-800 flex flex-col">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 md:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Resume Maker</h1>
                    <p className="text-gray-600 mt-1">Enter your details, and let AI craft and enhance the perfect resume for you.</p>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">1. Enter Your Information</h2>
                    <p className="text-sm text-gray-600 mb-4">Provide your details below. After generating, use the ✨ buttons in the preview to have the AI improve your summary and experience bullet points!</p>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={defaultPrompt} className="w-full h-80 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <button onClick={handleGenerateResume} disabled={isLoading || isImproving.type !== null} className="mt-4 w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all duration-300 transform hover:scale-105 disabled:scale-100">
                        <BrainCircuitIcon />
                        {isLoading ? 'Generating...' : 'Generate Resume'}
                    </button>
                    {resumeData && (
                         <button onClick={handleDownloadPdf} disabled={isLoading || isImproving.type !== null} className="mt-4 w-full flex items-center justify-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-all duration-300 transform hover:scale-105 disabled:scale-100">
                            <DownloadIcon />
                            {isLoading ? 'Downloading...' : 'Download as PDF'}
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-2">
                    <h2 className="text-xl font-semibold mb-4 px-4 pt-4">2. Preview & Refine</h2>
                    <div id="resume-preview-container" className="bg-gray-50 p-1 rounded-lg h-full overflow-y-auto">
                        {isLoading && ( <div className="flex justify-center items-center h-full flex-col text-center p-8"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div><p className="mt-4 text-gray-600 font-semibold">The AI is building your resume...</p></div> )}
                        {error && ( <div className="flex justify-center items-center h-full p-4"><div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p className="font-bold">Error</p><p>{error}</p></div></div> )}
                        {!isLoading && !error && !resumeData && ( <div className="flex justify-center items-center h-full flex-col text-center p-8"><svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><p className="mt-4 text-gray-500">Your generated resume will appear here.</p></div> )}
                        {resumeData && (
                            <div ref={resumePreviewRef} className="p-8 bg-white text-sm" style={{ width: '210mm', minHeight: '297mm' }}>
                                <header className="text-center border-b-2 pb-4 border-gray-300">
                                    <h1 className="text-4xl font-bold tracking-wider uppercase">{resumeData.name}</h1>
                                    <div className="flex justify-center items-center flex-wrap space-x-4 mt-2 text-xs text-gray-600">
                                        <span>{resumeData.email}</span><span>&bull;</span><span>{resumeData.phone}</span>
                                        {resumeData.linkedin && ( <><span>&bull;</span><a href={`https://${resumeData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{resumeData.linkedin}</a></> )}
                                        {resumeData.github && ( <><span>&bull;</span><a href={`https://${resumeData.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{resumeData.github}</a></> )}
                                    </div>
                                </header>
                                <main className="mt-6">
                                    <section>
                                        <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-2">
                                            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700">Summary</h2>
                                            <button onClick={() => handleImproveSection('summary', resumeData.summary)} disabled={isLoading || isImproving.type !== null} className="flex items-center text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:bg-gray-200 disabled:text-gray-500 px-2 py-1 rounded-md transition-colors">
                                                {isImproving.type === 'summary' ? <div className="w-3 h-3 border-2 border-purple-700 border-t-transparent rounded-full animate-spin mr-1"></div> : <SparklesIcon className="w-3 h-3 mr-1" />}
                                                ✨ Improve with AI
                                            </button>
                                        </div>
                                        <p className="text-gray-700">{resumeData.summary}</p>
                                    </section>
                                    <section className="mt-6">
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-gray-200 pb-1">Experience</h2>
                                        {resumeData.experience.map((job, index) => (
                                            <div key={index} className="mt-3">
                                                <div className="flex justify-between items-baseline"><h3 className="font-semibold text-base">{job.title}</h3><p className="text-xs text-gray-600">{job.dates}</p></div>
                                                <div className="flex justify-between items-baseline"><p className="text-gray-800 font-medium">{job.company}</p><p className="text-xs text-gray-500">{job.location}</p></div>
                                                <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">{job.description.map((desc, i) => <li key={i}>{desc}</li>)}</ul>
                                                <div className="text-right mt-2">
                                                    <button onClick={() => handleImproveSection('experience', job.description, index)} disabled={isLoading || isImproving.type !== null} className="inline-flex items-center text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:bg-gray-200 disabled:text-gray-500 px-2 py-1 rounded-md transition-colors">
                                                        {isImproving.type === 'experience' && isImproving.index === index ? <div className="w-3 h-3 border-2 border-purple-700 border-t-transparent rounded-full animate-spin mr-1"></div> : <SparklesIcon className="w-3 h-3 mr-1" />}
                                                        ✨ Improve Bullet Points
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </section>
                                    <section className="mt-6">
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-gray-200 pb-1">Education</h2>
                                        {resumeData.education.map((edu, index) => (
                                            <div key={index} className="mt-3">
                                                <div className="flex justify-between items-baseline"><h3 className="font-semibold text-base">{edu.degree}</h3><p className="text-xs text-gray-600">{edu.dates}</p></div>
                                                <p className="text-gray-800 font-medium">{edu.institution}</p>
                                            </div>
                                        ))}
                                    </section>
                                    <section className="mt-6">
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-gray-200 pb-1">Skills</h2>
                                        <div className="mt-2 flex flex-wrap gap-2">{resumeData.skills.map((skill, index) => ( <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">{skill}</span> ))}</div>
                                    </section>
                                </main>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <footer className="text-center py-4 text-sm text-gray-500">
                <p>
                    Created by <a href="https://www.linkedin.com/in/sjstar/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sahil Jaglan</a>.
                </p>
            </footer>
        </div>
    );
}
