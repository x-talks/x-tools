import { useState } from 'react';
import { TemplateSelector } from '../TemplateSelector';
import { useWizard } from '../../core/store';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Wand2 } from 'lucide-react';
import { WIZARD_CONTENT } from '../../core/rules';
import { LogoGenerator } from '../LogoGenerator';
import { TEAM_NAMES } from '../../core/names';


export function Step0_CreateTeam() {
    const { state, dispatch } = useWizard();
    const [teamName, setTeamName] = useState(state.team?.teamName || '');
    const [teamLogo, setTeamLogo] = useState(state.team?.logo || '');
    const [error, setError] = useState('');

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTeamLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAutoFill = () => {
        setTeamName("The " + TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)]);
    };


    const handleNext = () => {
        if (!teamName.trim()) {
            setError('Team name is required');
            return;
        }
        if (teamName.length < 3) {
            setError('Team name must be at least 3 characters');
            return;
        }

        // Auto-fill defaults if not already present
        const defaultPurpose = WIZARD_CONTENT.Purpose.Statements[Math.floor(Math.random() * WIZARD_CONTENT.Purpose.Statements.length)];
        const defaultVision = WIZARD_CONTENT.Vision.Statements[Math.floor(Math.random() * WIZARD_CONTENT.Vision.Statements.length)];
        const defaultMission = WIZARD_CONTENT.Mission.Statements[Math.floor(Math.random() * WIZARD_CONTENT.Mission.Statements.length)];
        const defaultStrategy = WIZARD_CONTENT.Strategy.Items[Math.floor(Math.random() * WIZARD_CONTENT.Strategy.Items.length)];

        // Pick 3 random values
        const shuffledValues = [...WIZARD_CONTENT.Value.Statements].sort(() => 0.5 - Math.random());
        const defaultValues = shuffledValues.slice(0, 3).map((v, i) => ({
            id: `val-${Date.now()}-${i}`,
            label: v,
            source: 'system' as const,
            explanation: 'Core value selected for this team.'
        }));

        dispatch({
            type: 'SET_TEAM',
            payload: {
                teamId: state.team?.teamId || crypto.randomUUID(),
                teamName,
                teamPurpose: state.team?.teamPurpose || defaultPurpose,
                goals: state.team?.goals || [],
                logo: teamLogo || undefined,
                createdAt: state.team?.createdAt || new Date().toISOString(),
                createdBy: 'current-user',
            },
        });

        // Pre-populate other steps if empty
        if (!state.vision?.text) dispatch({ type: 'SET_VISION', payload: { text: defaultVision, archetype: 'The Pioneer' } });
        if (!state.mission?.text) dispatch({ type: 'SET_MISSION', payload: { text: defaultMission, keywords: [] } });
        if (!state.strategy?.text) dispatch({ type: 'SET_STRATEGY', payload: { text: defaultStrategy.Strategy } });
        if (state.values.length === 0) dispatch({ type: 'SET_VALUES', payload: defaultValues });

        dispatch({ type: 'NEXT_STEP' });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Create New Circle</CardTitle>
                <div className="flex gap-2">
                    <TemplateSelector />
                    <Button variant="ghost" size="sm" onClick={handleAutoFill} title="Magic Fill">
                        <Wand2 className="h-4 w-4 text-purple-500" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                        Start by giving your circle a name. This will be the identity we build upon.
                    </p>
                </div>
                <div className="space-y-2">
                    <label htmlFor="teamName" className="text-sm font-medium text-slate-700">Circle Name</label>
                    <Input
                        id="teamName"
                        placeholder="e.g. Product Innovation Squad"
                        value={teamName}
                        onChange={(e) => {
                            setTeamName(e.target.value);
                            setError('');
                        }}
                        autoFocus
                        error={error && !teamName ? error : undefined}
                    />
                    {/* Error message handled by Input component */}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Team Logo (Optional)</label>
                    <div className="flex items-center gap-4">
                        {teamLogo && (
                            <img src={teamLogo} alt="Team Logo" className="h-12 w-12 rounded-full object-cover border border-slate-200" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">Or generate with AI</span>
                    </div>
                </div>

                <LogoGenerator
                    teamName={teamName}
                    onSelect={(dataUrl) => setTeamLogo(dataUrl)}
                />
            </CardContent>
            <CardFooter className="justify-end">
                <Button onClick={handleNext}>Next</Button>
            </CardFooter>


        </Card >
    );
}
