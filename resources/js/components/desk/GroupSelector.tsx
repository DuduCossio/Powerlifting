import type { DeskGroup } from '../../hooks/useDeskRegistrationForm';

interface GroupSelectorProps {
    value: DeskGroup;
    onChange: (group: DeskGroup) => void;
}

const groups: DeskGroup[] = ['A', 'B', 'C', 'D'];

export function GroupSelector({ value, onChange }: GroupSelectorProps) {
    return (
        <fieldset className="rounded border border-outline-variant bg-surface-container p-6">
            <legend className="px-2 font-label-caps text-label-caps uppercase tracking-widest text-secondary">Grupo de Levantamiento</legend>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {groups.map((group) => {
                    const checked = value === group;

                    return (
                        <label key={group} className="cursor-pointer">
                            <input
                                className="peer sr-only"
                                type="radio"
                                name="group"
                                value={group}
                                checked={checked}
                                onChange={() => onChange(group)}
                            />
                            <div className="flex items-center justify-center rounded border border-outline-variant bg-surface-container-low p-4 font-headline-md text-headline-md text-on-surface transition-all peer-checked:border-primary-container peer-checked:bg-primary-container peer-checked:text-background">
                                {group}
                            </div>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}
