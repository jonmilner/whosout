import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  image: PropTypes.string,
  memberName: PropTypes.string.isRequired,
  memberStatus: PropTypes.string,
  memberTitle: PropTypes.string,
  online: PropTypes.oneOf(['online', 'offline']),
  status: PropTypes.oneOf(['disabled', 'inactive']),
  theme: PropTypes.oneOf(['green', 'blue'])
};

const defaultProps = {
  image: undefined,
  memberStatus: undefined,
  memberTitle: undefined,
  online: undefined,
  status: undefined,
  theme: undefined
};

export default class Cards extends React.Component {
  render() {
    const {
      image,
      online,
      status,
      memberName,
      memberStatus,
      memberTitle,
      theme
    } = this.props;

    return (
      <li
        className={classNames({
          card: true,
          [`card--online-${online}`]: online,
          [`card--status-${status}`]: status,
          [`card--theme-${theme}`]: theme
        })}
      >
        <section className="card__content">
          <div className="member">
            <img className="member__image" alt={memberName} src={image} />
            <div className="member__header">
              {online && (
                <p className="dot">
                  <span>{online}</span>
                </p>
              )}
              {memberStatus && <p className="member__status">{memberStatus}</p>}
            </div>
            <div className="member__body">
              <h2 className="member__name">{memberName}</h2>
              {memberTitle && <p className="member__title">{memberTitle}</p>}
            </div>
          </div>
        </section>
      </li>
    );
  }
}

Cards.propTypes = propTypes;
Cards.defaultProps = defaultProps;
