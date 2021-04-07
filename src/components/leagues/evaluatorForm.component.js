import React, { Component } from 'react';
import { Header, Form, Input, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import EvaluatorService from '../../services/evaluator.service';

export default class EvaluatorFormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      evaluator: {},
      redirect: undefined,
    };
  }

  async componentDidMount() {
    const evaluatorId = this.props.match.params.evaluatorId;
    let evaluator = {};
    if (evaluatorId !== 'new') {
      evaluator = await EvaluatorService.get(evaluatorId);
    }

    const types = await EvaluatorService.getTypes();
    const typesOptions = types.map((type) => ({
      key: type,
      text: type,
      value: type,
    }));

    const entityOptions = [
      { key: 'matches', text: 'matches', value: 'matches' },
      { key: 'series', text: 'series', value: 'series' },
    ];

    this.setState({
      evaluator,
      typesOptions,
      entityOptions,
    });
  }

  async saveForm() {
    if (this.state.evaluator.id) {
      await EvaluatorService.update(this.props.match.params.leagueId, this.state.evaluator, this.state.evaluator.id);
    } else {
      await EvaluatorService.create(this.props.match.params.leagueId, this.state.evaluator);
    }

    this.setState({
      redirect: `/leagues/${this.props.match.params.leagueId}/evaluators`,
    });
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Přidat/Upravit vyhodnocení</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <label>Název</label>
            <Input
              required
              placeholder="Název"
              value={this.state.evaluator.name}
              onChange={(event) =>
                this.setState({
                  evaluator: {
                    ...this.state.evaluator,
                    name: event.target.value,
                  },
                })
              }
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Typ"
              options={this.state.typesOptions}
              value={this.state.evaluator.type}
              placeholder="Vyberte typ"
              onChange={(event, { value }) => {
                this.setState({
                  evaluator: { ...this.state.evaluator, type: value },
                });
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Entita"
              options={this.state.entityOptions}
              value={this.state.evaluator.entity}
              placeholder="Vyberte entitu"
              onChange={(event, { value }) => {
                this.setState({
                  evaluator: { ...this.state.evaluator, entity: value },
                });
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Body</label>
            <Input
              required
              placeholder="Body"
              value={this.state.evaluator.points}
              onChange={(event) =>
                this.setState({
                  evaluator: {
                    ...this.state.evaluator,
                    points: event.target.value,
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
