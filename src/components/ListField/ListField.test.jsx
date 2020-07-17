import React from 'react';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import ListField from './index';
import { Collaborator, renderSuggestion } from '../Collaborator';

const mockClient = new MockAdapter(axios);

const input = {
  value: [
    {
      uuid: '6f23f2f8-10dd-454a-8497-2ba972c980c4',
      name: 'Waseda',
      profile_image_url: '/assets/new-80.png',
    },
    {
      uuid: '17d0e2c0-9a02-421b-93bf-d081339090cc',
      name: 'IBM',
      profile_image_url: '/assets/new-80.png',
    },
    {
      uuid: '2aba6189-ad7e-45a8-b269-bea071b80391',
      given_name: 'Wellesley',
      profile_image_url: '/assets/new-80.png',
    },
  ],
  onChange: jest.fn(),
};
// const owners = [{ key: 'MITx' }];
const autoCompleteCollaboratorResponses = {
  long: [
    {
      uuid: 'a7d0e2c0-9a02-421b-93bf-d081339090cc',
      image_url: '/assets/new-80.png',
      name: 'Stanford',
    },
    {
      uuid: 'b7d0e2c0-9a02-421b-93bf-d081339090cc',
      profile_image_url: '/assets/new-80.png',
      given_name: 'Berkeley',
    }],
};

const defaultProps = {
  input,
  renderSuggestion,
  renderItemComponent: Collaborator,
  createNewUrl: "/collaborators/new",
  itemType: "collaborator",
  meta: {
    submitFailed: false,
    error: '',
  },
};

const newCollaborator = {
  uuid: '00000000-0000-0000-0000-000000000000',
  image_url: '/assets/new-80.png',
  name: 'I am a school'
};

const referredProps = {
  ...defaultProps,
  collaboratorInfo: {
    data: newCollaborator,
  },
  sourceInfo: {
    referringRun: 'DemoX+TestCourse',
  },
};

jest.mock('../Collaborator', () => ({
  Collaborator: () => <div className="mock-collaborator" />,
  // mock a generic name function so that drag and drop works
  getCollaboratorName: collaborator => collaborator.name,
}));

describe('ListField', () => {

  console.log('render', renderSuggestion)
  afterEach(() => {
    // Clear onChange's call count after each test
    input.onChange.mockClear();
    // reset api client response
    mockClient.reset();
  });

  it('renders a list of item members and an autocomplete input', () => {
    const component = shallow(<ListField {...defaultProps} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  // it('renders correctly with referred props', () => {
  //   const component = shallow(<ListField {...referredProps} />);
  //   expect(shallowToJson(component)).toMatchSnapshot();
  // });

  // it('renders correctly with an error after failed submission', () => {
  //   const metaFailedProps = {

  //     ...defaultProps,
  //     meta: {
  //       submitFailed: true,
  //       error: 'This field is required',
  //     },
  //   };
  //   const component = shallow(<ListField {...metaFailedProps} />);
  //   expect(shallowToJson(component)).toMatchSnapshot();
  // });

  // // none yet?
  // // it('gets/clears suggestions for autocomplete', (done) => {
  // //   mockClient.onGet('http://localhost:18381/api/v1/search/collaborator_typeahead/?q=MIT')
  // //     .replyOnce(200, JSON.stringify(autoCompleteCollaboratorResponses.long));
  // //   const component = mount(<ListField {...defaultProps} owners={owners} />);
  // //   component.instance().onSuggestionsFetchRequested({ value: 'long' }).then(() => {
  // //     let { suggestions } = component.state();
  // //     // check that we get the expected response from the API
  // //     expect(suggestions[0].family_name).toEqual('Longstocking');
  // //     expect(suggestions[0].uuid).toEqual('a7d0e2c0-9a02-421b-93bf-d081339090cc');
  // //     // check that we get the 'add new' link at the bottom of our expected results.
  // //     expect(suggestions[2].url).not.toBeNull();
  // //     expect(suggestions[2].item_text).toEqual('Add New Collaborator');

  // //     // check that clearing suggestions...clears suggestions
  // //     component.instance().onSuggestionsClearRequested();
  // //     ({ suggestions } = component.state());
  // //     expect(suggestions.length).toEqual(0);
  // //     // required because we are 'expect'ing inside of an async promise
  // //     done();
  // //   });
  // // });

  // it('gets no suggestions for short autocomplete', (done) => {
  //   const component = mount(<ListField {...defaultProps} />);
  //   component.instance().onSuggestionsFetchRequested({ value: 'lo' }).then(() => {
  //     const state = component.state().suggestions;
  //     // check that we get no suggestions for a query that is too short
  //     expect(state.length).toEqual(0);
  //     // required because we are 'expect'ing inside of an async promise
  //     done();
  //   });
  // });

  // it('updates selected item on form', () => {
  //   const component = mount(<ListField {...defaultProps} />);
  //   let { listField } = component.state();
  //   // we start with 3 collaborator members
  //   expect(listField.length).toEqual(3);
  //   component.instance().onSuggestionEntered(
  //     null,
  //     { suggestion: autoCompleteCollaboratorResponses.long[0] },
  //   );
  //   // confirm that entering a collaborator member not in the list adds it
  //   ({ ListField } = component.state());
  //   expect(ListField.length).toEqual(4);
  //   // confirm that entering a collaborator member already in the list does NOT add it
  //   component.instance().onSuggestionEntered(
  //     null,
  //     { suggestion: autoCompleteCollaboratorResponses.long[0] },
  //   );
  //   expect(ListField.length).toEqual(4);
  // });

  // it('correctly handles removing members of the item', () => {
  //   const component = mount(<ListField {...defaultProps} />);
  //   let collaborators = component.find('.mock-collaborator');
  //   expect(collaborators).toHaveLength(input.value.length);

  //   const firstCollaborator = component.state().ListField[0];
  //   // Petend we deleted the first collaborator
  //   const firstUuid = input.value[0].uuid;
  //   component.instance().handleRemove(firstUuid);

  //   // Verify that the onChange method has been called
  //   expect(input.onChange).toBeCalled();

  //   // Verify that the first collaborator has been removed
  //   component.update();
  //   collaborators = component.find('.mock-collaborator');
  //   expect(collaborators).toHaveLength(input.value.length - 1);

  //   const newFirstCollaborator = component.state().ListField[0];
  //   expect(firstCollaborator).not.toEqual(newFirstCollaborator);
  // });

  // it('correctly handles reordering members of the item', () => {
  //   const component = mount(<ListField {...defaultProps} />);
  //   // Find the first collaborator.
  //   const firstCollaborator = component.state().ListField[0].uuid;

  //   const result = {
  //     source: {
  //       index: 0,
  //     },
  //     destination: {
  //       index: 2,
  //     },
  //   };
  //   // Pretend we dragged the first collaborator to the end.
  //   component.instance().onDragEnd(result);

  //   // Verify that the onChange method has been called
  //   expect(input.onChange).toBeCalled();

  //   // Verify that it is on the end.
  //   expect(firstCollaborator).toEqual(component.state().ListField[2].uuid);
  // });

  // it('does not re-order when dragged outside of the list', () => {
  //   const component = mount(<ListField {...defaultProps} />);
  //   // Find the first collaborator.
  //   const firstCollaborator = component.state().ListField[0].uuid;

  //   const result = {
  //     source: {
  //       index: 0,
  //     },
  //   };
  //   // Pretend we dragged the first collaborator outside the list.
  //   component.instance().onDragEnd(result);

  //   // Verify that the onChange method has NOT been called
  //   expect(input.onChange).not.toBeCalled();
  //   expect(firstCollaborator).toEqual(component.state().ListField[0].uuid);
  // });

  // it('does not re-order when dragged to the same position', () => {
  //   const component = mount(<ListField {...defaultProps} />);
  //   // Find the first collaborator.
  //   const firstCollaborator = component.state().ListField[0].uuid;

  //   const result = {
  //     source: {
  //       index: 0,
  //     },
  //     destination: {
  //       index: 0,
  //     },
  //   };
  //   // Pretend we dragged the first collaborator to their original position.
  //   component.instance().onDragEnd(result);
  //   // Verify that the onChange method has NOT been called
  //   expect(input.onChange).not.toBeCalled();
  //   expect(firstCollaborator).toEqual(component.state().ListField[0].uuid);
  // });

  // it('adds the referred collaborator to state when one is given', () => {
  //   const component = mount(<ListField {...referredProps} />);

  //   const { ListField } = component.state();

  //   expect(ListField[ListField.length - 1]).toEqual(newcollaborator);
  // });
});
