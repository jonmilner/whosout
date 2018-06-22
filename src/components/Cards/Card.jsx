import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  image: PropTypes.string,
  memberName: PropTypes.string.isRequired,
  memberStatus: PropTypes.string,
  memberTitle: PropTypes.string,
  online: PropTypes.oneOf(['online', 'offline']),
  theme: PropTypes.string
};

const defaultProps = {
  image: undefined,
  memberStatus: undefined,
  memberTitle: undefined,
  online: undefined,
  theme: undefined
};

export default class Cards extends React.Component {
  getStatus() {
    if (this.props.memberStatus === 'In a meeting') {
      return 'meeting';
    } else if (this.props.memberStatus === 'Working remotely') {
      return 'remote';
    } else if (this.props.memberStatus === 'Vacationing') {
      return 'vacation';
    }
    return undefined;
  }

  getEmoji() {
    if (this.props.memberStatus === 'In a meeting') {
      return (
        <div className="member__status">
          <span aria-label="In a Meeting" className="member__emoji" role="img">
            🗓
          </span>
          <span className="member__status-text">In a Meeting</span>
        </div>
      );
    } else if (this.props.memberStatus === 'Working remotely') {
      return (
        <div className="member__status">
          <span aria-label="Working remotely" className="member__emoji" role="img">
            🏠
          </span>
          <span className="member__status-text">Remote</span>
        </div>
      );
    } else if (this.props.memberStatus === 'Vacationing') {
      return (
        <div className="member__status">
          <span aria-label="Vacationing" className="member__emoji" role="img">
            🌴
          </span>
          <span className="member__status-text">On Vacation</span>
        </div>
      );
    }
    return undefined;
  }

  render() {
    const {
      image, online, memberName, memberStatus, memberTitle, theme
    } = this.props;

    return (
      <li
        className={classNames({
          card: true,
          [`card--online-${online}`]: online,
          [`card--status-${this.getStatus()}`]: memberStatus,
          [`card--theme-${theme}`]: theme
        })}
      >
        <section className="card__content">
          <div className="member">
            <img className="member__image" alt={memberName} src={image} />
            {this.getEmoji()}
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
