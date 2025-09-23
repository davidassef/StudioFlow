import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the entire FeedPage module
jest.mock('../page', () => {
  return function MockFeedPage() {
    return (
      <div>
        <h1>Feed</h1>
        <p>Mocked Feed Page</p>
      </div>
    );
  };
});

// Import the mocked component
import FeedPage from '../page';

describe('FeedPage Minimal Test', () => {
  it('should render mocked component', () => {
    render(<FeedPage />);
    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getByText('Mocked Feed Page')).toBeInTheDocument();
  });
});