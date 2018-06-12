import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

import Card from './Card';

import '../../assets/styles/index.css';
import './index.css';

declare var DEFINE_SLACK_TOKEN;

const propTypes = {
  // Only show members who are have a status set.
  filterMembersWithoutStatus: PropTypes.bool,
  // Show indicator for who's currently online.
  showOnlineIndicator: PropTypes.bool
};

const defaultProps = {
  filterMembersWithoutStatus: false,
  showOnlineIndicator: true
};

const getQueryVariable = (variable) => {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return unescape(pair[1]);
    }
  }
  return false;
};

export default class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: false,
      members: [],
      token: DEFINE_SLACK_TOKEN
    };
  }

  componentDidMount() {
    this.getSlackData();

    // refresh data every 10 minutes
    this.interval = setInterval(() => this.getSlackData(), 600000);
  }

  getFields(userId) {
    const { members } = this.state;

    if (this.memberProfilesLoading.find(x => x === userId)) {
      return;
    }

    this.memberProfilesLoading.push(userId);

    fetch(`https://slack.com/api/users.profile.get?token=${this.state.token}&user=${userId}`)
      .then(profileResponse => profileResponse.json())
      .then((response) => {
        const member = members.find(m => m.id === userId);
        if (member && member.profile && response && response.profile) {
          members.find(m => m.id === userId).profile.fields = response.profile.fields;
        }

        this.memberProfilesLoading.splice(this.memberProfilesLoading.indexOf(userId), 1);
        this.setState({ members });
      })
      .catch((error) => {
        this.memberProfilesLoading.splice(this.memberProfilesLoading.indexOf(userId), 1);
        this.setState({ error, isLoading: false });
      });
  }

  getSlackData() {
    return fetch(`https://slack.com/api/users.list?token=${this.state.token}&presence=true`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong...');
      })
      .then((data) => {
        this.setState({ members: data.members, isLoading: false });
        return data.members;
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  memberProfilesLoading = [];

  render() {
    const { showOnlineIndicator, filterMembersWithoutStatus } = this.props;
    const { isLoading, members, error } = this.state;

    const allMembers = members.filter(item =>
      !item.deleted &&
        !item.is_bot &&
        !item.is_restricted &&
        item.name !== 'slackbot' &&
        item.name !== 'subscriptions');

    const membersWithStatus = allMembers.filter(item =>
      item.profile.status_text === 'Working remotely' ||
        item.profile.status_text === 'Vacationing' ||
        item.profile.status_text === 'Out sick' ||
        item.profile.status_text);

    const preProfileMembers = filterMembersWithoutStatus ? membersWithStatus : allMembers;

    preProfileMembers.forEach((member) => {
      if (!member.profile.fields) {
        this.getFields(member.id);
      }
    });

    const displayedMembers = preProfileMembers.filter(item =>
      (getQueryVariable('dept')
        ? item.profile && item.profile.fields
          ? item.profile.fields.XfB2QXEFQW
            ? item.profile.fields.XfB2QXEFQW.value === getQueryVariable('dept')
            : false
          : false
        : true));

    if (error) {
      return <p>Error: {error.toString()}</p>;
    }

    if (isLoading) {
      return <p>Loading...</p>;
    }

    let layout = 'cards--layout-max-4';

    if (displayedMembers.length <= 4) {
      layout = 'cards--layout-max-4';
    } else if (displayedMembers.length <= 9) {
      layout = 'cards--layout-max-9';
    } else if (displayedMembers.length <= 12) {
      layout = 'cards--layout-max-12';
    } else if (displayedMembers.length <= 16) {
      layout = 'cards--layout-max-16';
    } else if (displayedMembers.length <= 20) {
      layout = 'cards--layout-max-20';
    } else if (displayedMembers.length <= 25) {
      layout = 'cards--layout-max-25';
    } else if (displayedMembers.length <= 30) {
      layout = 'cards--layout-max-30';
    } else if (displayedMembers.length <= 36) {
      layout = 'cards--layout-max-36';
    } else if (displayedMembers.length <= 42) {
      layout = 'cards--layout-max-42';
    } else if (displayedMembers.length <= 49) {
      layout = 'cards--layout-max-49';
    } else if (displayedMembers.length <= 56) {
      layout = 'cards--layout-max-56';
    } else if (displayedMembers.length <= 64) {
      layout = 'cards--layout-max-64';
    } else if (displayedMembers.length <= 72) {
      layout = 'cards--layout-max-72';
    } else if (displayedMembers.length <= 81) {
      layout = 'cards--layout-max-81';
    }

    return (
      <ol className={`cards ${layout}`}>
        {displayedMembers.map(item => (
          <Card
            {...{
              image: item.profile.image_512,
              key: item.id,
              online:
                showOnlineIndicator && item.presence === 'active'
                  ? 'online'
                  : item.presence === 'away'
                    ? 'offline'
                    : undefined,
              status:
                item.profile.status_text === 'Vacationing' ||
                item.profile.status_text === 'Out sick'
                  ? 'disabled'
                  : undefined,
              memberName: item.profile.real_name_normalized,
              memberStatus: item.profile.status_text,
              memberTitle: item.profile.title,
              theme:
                item.profile.status_text === 'Working remotely'
                  ? 'blue'
                  : item.profile.status_text === 'Vacationing'
                    ? 'green'
                    : item.profile.status_text === 'Out sick'
                      ? 'orange'
                      : undefined,
              department:
                item.profile && item.profile.fields && item.profile.fields.XfB2QXEFQW
                  ? item.profile.fields.XfB2QXEFQW.value
                  : undefined
            }}
          />
        ))}
      </ol>
    );
  }
}

Cards.propTypes = propTypes;
Cards.defaultProps = defaultProps;
