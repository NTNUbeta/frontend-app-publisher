import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Autosuggest from 'react-autosuggest';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Collaborator } from '../Collaborator';
import NewInstructorImage from '../../../assets/new-instructor-80.png';
import store from '../../data/store';
import sourceInfo from '../../data/actions/sourceInfo';

class CollaboratorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCollaborators: this.props.collaborators || [],
      suggestions: [], // the suggestions returned by the discovery service for autocomplete
      searchString: '', // search input provided by the user
    };

    this.onChange = this.onChange.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.onSuggestionEntered = this.onSuggestionEntered.bind(this);
  }

  onSuggestionsFetchRequested({ value }) {
    const {
      collaboratorOptions,
    } = this.props;

    if (value.length >= 3) {
      const results = collaboratorOptions.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));
      results.push({
        image_url: '',
        uuid: '',
        url: '/collaborators/new',
        item_text: 'Add New Collaborator',
      });
      this.setState({ suggestions: results });
    }
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  onChange(event, { newValue }) {
    this.setState({ searchString: newValue });
  }

  onDragEnd(result) {
    // Element was dropped outside the list.
    if (!result.destination) {
      return;
    }
    // Element has not actually moved.
    if (result.destination.Collaborators === result.source.Collaborators) {
      return;
    }

    const getRearrangedCollaboratorList = prevState => {
      const newCollaboratorList = Array.from(prevState.currentCollaborators);
      const [removed] = newCollaboratorList.splice(result.source.Collaborators, 1);
      newCollaboratorList.splice(result.destination.Collaborators, 0, removed);
      return newCollaboratorList;
    };

    this.setState(prevState => ({
      currentCollaborators: getRearrangedCollaboratorList(prevState),
    }), () => this.props.input.onChange(this.state.currentCollaborators));
  }

  onSuggestionEntered(event, { suggestion }) {
    // clear search string to allow for another collaborator to be added.
    this.setState({ searchString: '' });
    if (suggestion.item_text) {
      // Send users to the create collaborator page
      const { courseUuid } = this.props;
      store.dispatch(sourceInfo(`/courses/${courseUuid}`));
      store.dispatch(push('/collaborators/new'));
      return;
    }

    const addToCollaboratorsList = prevState => {
      const newCollaboratorsList = Array.from(prevState.currentCollaborators);
      // if collaborator NOT already selected
      if (!newCollaboratorsList.some(collaborator => collaborator.uuid === suggestion.uuid)) {
        newCollaboratorsList.push(suggestion); // add to component
        // state
      }
      return newCollaboratorsList;
    };

    // add to form state (trigger change action)
    this.setState(prevState => ({
      currentCollaborators: addToCollaboratorsList(prevState),
    }));
  }

  getSuggestionValue(selectedValue) {
    if (selectedValue.item_text) {
      return selectedValue.item_text;
    }
    return selectedValue.name;
  }

  handleRemove(uuid) {
    this.setState(prevState => ({
      currentCollaborators: prevState.currentCollaborators.filter(staffer => staffer.uuid !== uuid),
    }), () => this.props.input.onChange(this.state.currentCollaborators));
  }

  renderSuggestion(suggestion) {
    return (
      <div className="d-flex flex-row m-1 p-1">
        <div className="m-1 p-1 w-25">
          <img
            src={suggestion.image_url || NewInstructorImage}
            alt={`logo for ${suggestion.name}`}
            className="rounded-circle w-100"
          />
        </div>
        <div className="m-1 p-1 w-75">
          <div className="m-1 p-1">{suggestion.name}</div>
          <div className="m-1 p-1">
            {suggestion.item_text && (
              <span>{suggestion.item_text}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      disabled,
    } = this.props;
    const {
      suggestions,
      searchString,
      currentCollaborators,
    } = this.state;

    const inputProps = {
      placeholder: '',
      value: searchString,
      onChange: this.onChange,
      type: 'text',
      disabled,
      className: 'form-control',
    };

    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="CollaboratorList" direction="vertical">
            {provided => (
              <div className="staff-list container" ref={provided.innerRef} {...provided.droppableProps}>
                {currentCollaborators && currentCollaborators.map((collaborator, index) => (
                  <Draggable
                    draggableId={collaborator.uuid}
                    index={index}
                    key={collaborator.uuid}
                    isDragDisabled={disabled}
                  >
                    {draggableProvided => (
                      <div
                        className="staffer-wrapper col-12 my-2"
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.dragHandleProps}
                        {...draggableProvided.draggableProps}
                      >
                        <Collaborator
                          onRemove={this.handleRemove}
                          collaborator={collaborator}
                          {...this.props}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/no-noninteractive-element-interactions */}
        <label className="w-100" id="label-collaborator-search" htmlFor="collaborator-search" onKeyDown={this.handleAutosuggestEnterEvent}>
          <strong>Search or add new collaborator:</strong>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={this.onSuggestionEntered}
            alwaysRenderSuggestions={searchString.length > 2}
            id="collaborator-search"
          />
        </label>
        {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */}
      </div>
    );
  }
}

CollaboratorList.propTypes = {
  collaboratorOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
  })),
  disabled: PropTypes.bool,
  courseUuid: PropTypes.string.isRequired,
  collaborators: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
  })),
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

CollaboratorList.defaultProps = {
  disabled: false,
  collaboratorOptions: [],
  collaborators: [],
};

export default CollaboratorList;
