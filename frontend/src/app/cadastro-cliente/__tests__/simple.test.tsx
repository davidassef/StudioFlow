import { render, screen } from '@testing-library/react';
import SimpleTestComponent from '../test-simple';

describe('SimpleTestComponent', () => {
  it('deve renderizar corretamente', () => {
    render(<SimpleTestComponent />);
    
    expect(screen.getByText('Teste Simples')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });
});