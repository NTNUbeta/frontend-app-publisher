import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import { Link } from 'react-router-dom';

import sourceInfo from '../../data/actions/sourceInfo';
import store from '../../data/store';

import NewInstructorImage from '../../../assets/new-instructor-80.png';

const contains = (stringA, stringB) => stringA.toLowerCase().includes(stringB.toLowerCase());
const filterSuggestions = (value, allCollaborators) => allCollaborators.filter(({ name }) => contains(name, value));


const fetchCollabSuggestions = (all) => {
  const inner = (value) => Promise.resolve({ data: filterSuggestions(value, all) });
  return inner;
};

const renderSuggestion = (suggestion) => (
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

export const Collaborator = ({
  item: {
    image: {
      original: {
        url,
      },
    },
    uuid,
    name,
  },
  onRemove,
  disabled,
  referrer,
}) => (
  <>
    <div className="staffer-image-wrapper overflow-hidden">
      <img src={url} className="rounded-circle w-25" alt="" />
    </div>
    <div className="staffer-details">
      <button
        type="button"
        className="btn js-delete-btn mr-1 p-0"
        onClick={() => onRemove(uuid)}
        disabled={disabled}
      >
        <Icon
          id={`delete-icon-${uuid}`}
          className="fa fa-trash fa-fw text-danger"
          screenReaderText={`Remove ${name}`}
        />
      </button>
      { !disabled
      // Don't show the edit link at all if fields should be disabled
      && (
        <Link
          to={{
            pathname: `/collaborators/${uuid}`,
            state: {
              name,
              url,
              uuid,
            },
          }}
          className="btn mr-1 p-0"
          onClick={() => store.dispatch(sourceInfo(referrer))}
        >
          <Icon
            id={`edit-icon-${uuid}`}
            className="fa fa-edit fa-fw"
            screenReaderText={`Edit ${name}`}
            title="Edit"
          />
        </Link>
      )}
      <span className="name font-weight-bold">
        {name}
      </span>
    </div>
  </>
);

Collaborator.propTypes = {
  onRemove: PropTypes.func.isRequired,
  item: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.shape({
      original: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
  }).isRequired,
  disabled: PropTypes.bool,
  referrer: PropTypes.string.isRequired,
};

Collaborator.defaultProps = {
  disabled: false,
};

export {
  fetchCollabSuggestions,
  renderSuggestion,
};
