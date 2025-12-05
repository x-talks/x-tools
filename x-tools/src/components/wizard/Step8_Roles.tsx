import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { ROLES_LIBRARY } from '../../core/rules';
import type { Role, Person } from '../../core/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Trash2, User } from 'lucide-react';

export function Step8_Roles() {
    const { state, dispatch } = useWizard();
    const [selectedRoles, setSelectedRoles] = useState<Role[]>(state.roles);
    const [people, setPeople] = useState<Person[]>(state.people);

    // Pre-fill with examples if empty
    useEffect(() => {
        if (selectedRoles.length === 0 && state.roles.length === 0) {
            // Pick 3 common roles
            const commonRoles = ['Product Owner', 'Tech Lead', 'Designer'];
            setSelectedRoles(commonRoles);
        }
    }, []);
    const [newPersonName, setNewPersonName] = useState('');
    const [newPersonRole, setNewPersonRole] = useState('');
    const [newPersonEmail, setNewPersonEmail] = useState('');
    const [newPersonResponsibilities, setNewPersonResponsibilities] = useState('');
    const [newPersonPicture, setNewPersonPicture] = useState('');

    const handleToggleRole = (role: Role) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleAddPerson = () => {
        if (!newPersonName || !newPersonRole) return;
        const newPerson: Person = {
            id: crypto.randomUUID(),
            name: newPersonName,
            role: newPersonRole,
            email: newPersonEmail,
            responsibilities: newPersonResponsibilities,
            picture: newPersonPicture,
            accessLevel: 'editor'
        };
        setPeople([...people, newPerson]);
        setNewPersonName('');
        setNewPersonRole('');
        setNewPersonEmail('');
        setNewPersonResponsibilities('');
        setNewPersonPicture('');
        // Auto-select role if not already selected
        if (!selectedRoles.includes(newPersonRole)) {
            setSelectedRoles([...selectedRoles, newPersonRole]);
        }
    };

    const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPersonPicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePerson = (id: string) => {
        setPeople(people.filter(p => p.id !== id));
    };

    const handleNext = () => {
        dispatch({ type: 'SET_ROLES', payload: selectedRoles });
        dispatch({ type: 'SET_PEOPLE', payload: people });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handlePrev = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Step 8: Roles & People</CardTitle>
                <p className="text-sm text-slate-500">Clarify responsibilities and ownership.</p>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Roles Selection */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900">Select Team Roles</h3>
                    <p className="text-sm text-slate-500">Which roles exist in your team?</p>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-md">
                        {ROLES_LIBRARY.map(role => (
                            <button
                                key={role}
                                onClick={() => handleToggleRole(role)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedRoles.includes(role)
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* People Assignment */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900">Add Team Members</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Name"
                            placeholder="John Doe"
                            value={newPersonName}
                            onChange={(e) => setNewPersonName(e.target.value)}
                        />
                        <Input
                            label="Email (Optional)"
                            placeholder="john@example.com"
                            value={newPersonEmail}
                            onChange={(e) => setNewPersonEmail(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Role</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                value={newPersonRole}
                                onChange={(e) => setNewPersonRole(e.target.value)}
                            >
                                <option value="">Select Role...</option>
                                {selectedRoles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                                {ROLES_LIBRARY.filter(r => !selectedRoles.includes(r)).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Picture (Optional)</label>
                            <div className="flex items-center gap-2">
                                {newPersonPicture && (
                                    <img src={newPersonPicture} alt="Preview" className="h-8 w-8 rounded-full object-cover" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePictureUpload}
                                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Responsibilities (Optional)</label>
                        <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            placeholder="Key responsibilities..."
                            value={newPersonResponsibilities}
                            onChange={(e) => setNewPersonResponsibilities(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleAddPerson} disabled={!newPersonName || !newPersonRole}>
                            <Plus className="mr-2 h-4 w-4" /> Add Person
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {people.map(person => (
                            <div key={person.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{person.name}</p>
                                        <p className="text-xs text-slate-500">{person.role} {person.email ? `• ${person.email}` : ''}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleRemovePerson(person.id)} className="text-slate-400 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        {people.length === 0 && (
                            <p className="text-sm text-slate-400 italic text-center py-4">No team members added yet.</p>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={handlePrev}>Back</Button>
                <Button onClick={handleNext}>Next: Team Canvas</Button>
            </CardFooter>
        </Card>
    );
}
