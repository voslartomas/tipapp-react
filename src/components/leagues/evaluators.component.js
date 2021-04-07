import React, { Component } from 'react';
import { Header, Button, Divider, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import EvaluatorService from '../../services/evaluator.service';

export default class EvaluatorsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      evaluators: [],
    };
  }

  async componentDidMount() {
    this.loadEvaluators();
  }

  async loadEvaluators() {
    const evaluators = await EvaluatorService.getAll(this.props.match.params.leagueId);
    this.setState({ evaluators });
  }

  render() {
    return (
      <div>
        <Header as="h1">Bodování</Header>
        <Link to={`/leagues/${this.props.match.params.leagueId}/evaluators/form/new`}>
          <Button primary>Přidat vyhodnocení</Button>
        </Link>
        <Divider />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Název</Table.HeaderCell>
              <Table.HeaderCell>Typ</Table.HeaderCell>
              <Table.HeaderCell>Entita</Table.HeaderCell>
              <Table.HeaderCell>Body</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.evaluators.map((evaluator) => (
              <Table.Row>
                <Table.Cell>{evaluator.name}</Table.Cell>
                <Table.Cell>{evaluator.type}</Table.Cell>
                <Table.Cell>{evaluator.entity}</Table.Cell>
                <Table.Cell>{evaluator.points}</Table.Cell>
                <Table.Cell>Smazat upravit</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
