import { useWizard } from '../core/store';


export function TeamCanvas() {
    const { state } = useWizard();
    const { team, vision, mission, strategy, values, principles, behaviors, goals, roles, people } = state;

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 p-8 bg-white min-h-screen print:p-0 pb-32">
            <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900">Team Canvas</h1>
                    <p className="text-slate-500 mt-1">Strategic Alignment & Culture Map</p>
                </div>
                <div className="text-right">
                    <div className="text-xl font-semibold text-slate-900">{team?.teamName || 'Untitled Team'}</div>
                    <div className="text-slate-500">{new Date().toLocaleDateString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Roles & People */}
                    <section className="border-2 border-slate-900 p-4 h-full min-h-[200px] relative group hover:bg-slate-50 transition-colors">
                        <div className="absolute top-4 right-4 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">People & Roles</h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-semibold text-sm text-slate-500 mb-1">Roles</h3>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {roles.length > 0 ? roles.map((r, i) => <li key={i}>{r}</li>) : <li className="text-slate-400 italic">No roles defined</li>}
                                </ul>
                            </div>
                            {people.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-sm text-slate-500 mb-1">Team Members</h3>
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                        {people.map((p, i) => <li key={i}>{p.name} ({p.role})</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Goals */}
                    <section className="border-2 border-slate-900 p-4 h-full min-h-[200px] relative group hover:bg-slate-50 transition-colors">
                        <div className="absolute top-4 right-4 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                        </div>
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">Common Goals</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {goals.length > 0 ? goals.map((g, i) => <li key={i} className="text-sm">{g}</li>) : <li className="text-slate-400 italic">No goals defined</li>}
                        </ul>
                    </section>
                </div>

                {/* Center Column - The Core */}
                <div className="space-y-6">
                    {/* Purpose (Heart) */}
                    <section className="border-2 border-slate-900 p-6 rounded-[3rem] text-center bg-slate-900 text-white shadow-xl transform hover:scale-[1.02] transition-transform">
                        <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest text-blue-200">Purpose</h2>
                        <p className="text-lg leading-relaxed font-medium">
                            {team?.teamPurpose || "No purpose defined yet."}
                        </p>
                    </section>

                    {/* Vision & Mission */}
                    <section className="border-2 border-slate-900 p-4 relative group hover:bg-slate-50 transition-colors">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold uppercase tracking-wide text-slate-900 mb-2">Vision</h3>
                                <p className="text-sm italic text-slate-700">{vision?.text || "No vision defined"}</p>
                            </div>
                            <div className="border-t border-slate-200 pt-4">
                                <h3 className="font-bold uppercase tracking-wide text-slate-900 mb-2">Mission</h3>
                                <p className="text-sm text-slate-700">{mission?.text || "No mission defined"}</p>
                            </div>
                        </div>
                    </section>

                    {/* Strategy */}
                    <section className="border-2 border-slate-900 p-4 relative group hover:bg-slate-50 transition-colors">
                        <div className="absolute top-4 right-4 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /></svg>
                        </div>
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">Strategy</h2>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{strategy?.text || "No strategy defined"}</p>
                    </section>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Values */}
                    <section className="border-2 border-slate-900 p-4 h-full min-h-[200px] relative group hover:bg-slate-50 transition-colors">
                        <div className="absolute top-4 right-4 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">Values</h2>
                        <ul className="space-y-3">
                            {values.length > 0 ? values.map((v, i) => (
                                <li key={i} className="text-sm">
                                    <span className="font-bold block">{v.label}</span>
                                    <span className="text-slate-500 text-xs">{v.explanation}</span>
                                </li>
                            )) : <li className="text-slate-400 italic">No values defined</li>}
                        </ul>
                    </section>

                    {/* Principles & Behaviors */}
                    <section className="border-2 border-slate-900 p-4 h-full min-h-[200px] relative group hover:bg-slate-50 transition-colors">
                        <div className="absolute top-4 right-4 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                        </div>
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">Rules & Activities</h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-sm text-slate-500 mb-2">Principles</h3>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {principles.length > 0 ? principles.map((p, i) => <li key={i}>{p.label}</li>) : <li className="text-slate-400 italic">No principles defined</li>}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm text-slate-500 mb-2">Behaviors</h3>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {behaviors.length > 0 ? behaviors.map((b, i) => <li key={i}>{b.label}</li>) : <li className="text-slate-400 italic">No behaviors defined</li>}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="mt-8 text-center print:hidden">
                <button onClick={() => window.print()} className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors">
                    Print / Save as PDF
                </button>
            </div>
        </div>
    );
}
