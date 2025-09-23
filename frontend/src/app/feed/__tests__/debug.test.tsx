import React from 'react'
import { render } from '@testing-library/react'

// Teste mínimo para debugar o erro
const SimpleComponent = () => <div>Hello World</div>

describe('Debug Test', () => {
  it('should render simple component', () => {
    const { container } = render(<SimpleComponent />)
    expect(container).toBeInTheDocument()
  })
})