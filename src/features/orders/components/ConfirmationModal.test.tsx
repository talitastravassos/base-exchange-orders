import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfirmationModal } from './ConfirmationModal';

describe('ConfirmationModal Component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmationModal
        isOpen={false}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders correctly when isOpen is true', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('shows processing state when isLoading is true', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={true}
      />,
    );
    expect(screen.getByText(/Processing.../i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Processing.../i }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
  });
});
