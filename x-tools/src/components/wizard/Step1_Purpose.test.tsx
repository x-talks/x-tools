import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { WizardProvider } from '../../core/store';
import { Step1_Purpose } from './Step1_Purpose';

describe('Step1_Purpose - State Persistence', () => {
    const renderWithProvider = (component: React.ReactElement) => {
        return render(
            <WizardProvider>
                {component}
            </WizardProvider>
        );
    };

    it('should preserve user input when navigating back and forth', async () => {
        const user = userEvent.setup();

        // Render the component
        const { rerender } = renderWithProvider(<Step1_Purpose />);

        // Find the purpose input field
        const input = screen.getByPlaceholderText(/purpose/i) || screen.getByRole('textbox');

        // Type some text
        const testPurpose = 'To innovate and deliver exceptional value';
        await user.type(input, testPurpose);

        // Wait for debounced save
        await waitFor(() => {
            expect(input).toHaveValue(testPurpose);
        }, { timeout: 1000 });

        // Simulate navigation away and back (unmount and remount)
        rerender(<div>Other Step</div>);
        rerender(<Step1_Purpose />);

        // Check that the value is still there
        const inputAfterNav = screen.getByPlaceholderText(/purpose/i) || screen.getByRole('textbox');
        await waitFor(() => {
            expect(inputAfterNav).toHaveValue(testPurpose);
        });
    });

    it('should sync local state when global state changes externally', async () => {
        const { rerender } = renderWithProvider(<Step1_Purpose />);

        const input = screen.getByPlaceholderText(/purpose/i) || screen.getByRole('textbox');

        // Initial value should be empty or default
        expect(input).toHaveValue('');

        // TODO: Simulate external state change via dispatch
        // This would require accessing the wizard context
        // For now, this test documents the expected behavior
    });
});
