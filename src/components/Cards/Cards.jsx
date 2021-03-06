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
  showOnlineIndicator: PropTypes.bool,
  // List of statues
  statuses: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired
  }))
};

const defaultProps = {
  filterMembersWithoutStatus: false,
  showOnlineIndicator: true,
  statuses: []
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
      token: DEFINE_SLACK_TOKEN,
      fields: [] // : Array<{ userId: int, fieldSet: Array<any> }>
    };
  }

  componentDidMount() {
    this.getSlackData();

    // refresh data every 10 minutes
    this.interval = setInterval(() => this.getSlackData(), 600000);
  }

  getFields(userId) {
    if (
      this.memberProfilesLoading.find(x => x === userId) ||
      this.state.fields.some(x => x.userId === userId)
    ) {
      return;
    }

    this.memberProfilesLoading.push(userId);

    fetch(`https://slack.com/api/users.profile.get?token=${this.state.token}&user=${userId}`)
      .then(profileResponse => profileResponse.json())
      .then((response) => {
        if (response && response.profile) {
          const newFields = this.state.fields;
          newFields.push({ userId, fields: response.profile.fields });
          this.setState({
            fields: newFields
          });
        }

        this.memberProfilesLoading.splice(this.memberProfilesLoading.indexOf(userId), 1);
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
        this.setState({ members: data.members });
        return data.members;
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  memberProfilesLoading = [];

  render() {
    const { filterMembersWithoutStatus, showOnlineIndicator, statuses } = this.props;
    const {
      isLoading, members, fields, error
    } = this.state;

    const allMembers = members.filter(item =>
      !item.deleted &&
        !item.is_bot &&
        !item.is_restricted &&
        item.name !== 'slackbot' &&
        item.name !== 'subscriptions');

    const membersWithStatus = allMembers.filter(item =>
      statuses.find(status => status.name === item.profile.status_text));

    const preProfileMembers = filterMembersWithoutStatus ? membersWithStatus : allMembers;

    preProfileMembers.forEach((member) => {
      if (!fields.some(x => x.userID === member.id)) {
        this.getFields(member.id);
      }
    });

    const displayedMembers = preProfileMembers.filter((item) => {
      if (!getQueryVariable('dept')) return true;

      const userFields = fields.find(x => x.userId === item.id);

      if (!userFields || !userFields.fields) return false;

      if (!userFields.fields.XfB2QXEFQW) return false;

      return userFields.fields.XfB2QXEFQW.value === getQueryVariable('dept');
    });

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

    // const cardTheme = (member) => {
    //   statuses.find((status) => {
    //     if (status.name === member.profile.status_text) {
    //       return status.color;
    //     }
    //     return undefined;
    //   });
    // };

    function cardTheme(member) {
      let obj;
      return (obj = statuses.find(status => status.name === member.profile.status_text))
        ? obj.color
        : '';
    }

    return (
      <ol className={`cards ${layout}`}>
        {displayedMembers.map(member => (
          <Card
            {...{
              allStatuses: statuses,
              image: member.profile.image_512,
              key: member.id,
              online:
                showOnlineIndicator && member.presence === 'active'
                  ? 'online'
                  : member.presence === 'away'
                    ? 'offline'
                    : undefined,
              memberName: member.profile.real_name_normalized,
              memberStatus: member.profile.status_text,
              memberTitle: member.profile.title,
              theme: cardTheme(member),
              department:
                member.profile && member.profile.fields && member.profile.fields.XfB2QXEFQW
                  ? member.profile.fields.XfB2QXEFQW.value
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
