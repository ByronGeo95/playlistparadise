import React from 'react';
import renderer from 'react-test-renderer';

test('Renders Correctly', () => {
const tree = renderer
.create(<div style={{ fontSize: '16px', color: '#707070', fontWeight: 'bold' }} >Login to get started with Playlist Paradise.</div>)
.toJSON();
expect(tree).toMatchSnapshot();
});

test('Fetch Test', () => {
  expect(fetch()).resolves.toBe('Fetch');
});