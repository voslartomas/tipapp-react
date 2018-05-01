import React, { Component } from 'react'
import { Card, Header, Button, Divider, Confirm, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import EvaluatorService from '../../services/evaluator.service'

export default class EvaluatorsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      evaluators: [],
    }
  }

  async componentDidMount() {
    this.loadEvaluators()
  }

  async loadEvaluators() {
    const evaluators = await EvaluatorService.getAll(this.props.match.params.leagueId)
    this.setState({ evaluators })
  }

  render() {
    return (
      <div>
        <Header as="h1">Bodování</Header>
        <Link to={`/leagues/${this.props.match.params.leagueId}/evaluators/form/new`}>
          <Button primary>
            Přidat vyhodnocení
          </Button>
        </Link>
        <Divider />
        <table>
          <tr>
            <th>Nazev</th>
            <th>Typ</th>
            <th>Entita</th>
            <th>Body</th>
            <th>Akce</th>
          </tr>
          {this.state.evaluators.map(evaluator => (
            <tr>
              <td>{evaluator.name}</td>
              <td>{evaluator.type}</td>
              <td>{evaluator.entity}</td>
              <td>{evaluator.points}</td>
              <td>Smazat upravit</td>
            </tr>
          ))}
        </table>
      </div>
    )
  }
}
