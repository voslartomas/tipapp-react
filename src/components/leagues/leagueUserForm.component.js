import React, { Component } from 'react';
import { Header, Form, Checkbox, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import LeagueUserService from '../../services/leagueUser.service';
import UserService from '../../services/user.service';

export default class LeagueUserFormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leagueUser: {},
      redirect: undefined,
    };
  }

  async componentDidMount() {
    const { leagueId, userId } = this.props.match.params;
    let leagueUser = {
      leagueId,
    };
    if (userId !== 'new') {
      leagueUser = await LeagueUserService.getUserById(leagueId, userId);
    }

    const users = await UserService.getUsers();
    const usersOptions = users.map((user) => ({
      key: user.id,
      text: `${user.firstName} ${user.lastName}`,
      value: user.id,
    }));

    this.setState({
      usersOptions,
      leagueUser,
    });
  }

  async saveForm() {
    const { leagueId } = this.props.match.params;
    if (this.state.leagueUser.id) {
      await LeagueUserService.update(leagueId, this.state.leagueUser, this.state.leagueUser.id);
    } else {
      await LeagueUserService.create(leagueId, this.state.leagueUser);
    }

    this.setState({
      redirect: `/leagues/${leagueId}/users`,
    });
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Přidat/Upravit uživatele</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Uživatel"
              options={this.state.usersOptions}
              value={this.state.leagueUser.userId}
              placeholder="Vyberte uživatele"
              onChange={(event, { name, value }) => {
                this.setState({
                  leagueUser: { ...this.state.leagueUser, userId: value },
                });
              }}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Zaplaceno"
              checked={this.state.leagueUser.paid}
              onChange={() =>
                this.setState({
                  leagueUser: {
                    ...this.state.leagueUser,
                    paid: !this.state.leagueUser.paid,
                  },
                })
              }
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Aktivní"
              checked={this.state.leagueUser.active}
              onChange={() =>
                this.setState({
                  leagueUser: {
                    ...this.state.leagueUser,
                    active: !this.state.leagueUser.active,
                  },
                })
              }
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Admin"
              checked={this.state.leagueUser.admin}
              onChange={() =>
                this.setState({
                  leagueUser: {
                    ...this.state.leagueUser,
                    admin: !this.state.leagueUser.admin,
                  },
                })
              }
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    );
  }
}
