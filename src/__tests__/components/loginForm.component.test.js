import React from 'react';
import ReactDOM from 'react-dom';
import LoginFormComponent from '../../components/loginForm.component';
import renderer from 'react-test-renderer';

describe('Login form component', () => {
  it('renders without crashing', () => {
    const component = renderer.create(<LoginFormComponent />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
