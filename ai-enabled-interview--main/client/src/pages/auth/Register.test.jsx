import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Register from './Register';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

window.alert = vi.fn();

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>{component}</BrowserRouter> 
  );
};

describe('Register Component', () => {
  it('renders the registration form', () => {
    renderWithRouter(<Register />);
    
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password@123')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', () => {
    renderWithRouter(<Register />);
    
    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInput = screen.getByPlaceholderText('Password@123');

    fireEvent.change(nameInput, { target: { name: 'name', value: 'ab' } });
    expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { name: 'email', value: 'invalid-email' } });
    expect(screen.getByText('Email must end with .com or .in')).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { name: 'password', value: 'weak' } });
    expect(screen.getByText('Password must start with uppercase, contain a number and special character')).toBeInTheDocument();
  });

  it('submits the form and calls register when inputs are valid', async () => {
    mockRegister.mockResolvedValue({ message: 'Registration Successful' });
    renderWithRouter(<Register />);
    
    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInput = screen.getByPlaceholderText('Password@123');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(nameInput, { target: { name: 'name', value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { name: 'email', value: 'johndoe@gmail.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'Password@123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'Password@123'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(window.alert).toHaveBeenCalledWith('Registration Successful');
    });
  });
});
