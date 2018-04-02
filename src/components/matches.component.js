import React, {Component} from 'react';
import MatchService from '../services/match.service'
import {Card} from 'semantic-ui-react'

export default class MatchesComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            matches: [],
        }
    }

    async componentDidMount() {
        const matches = await MatchService.getMatches(this.props.match.params.leagueId)

        this.setState({matches})
    }

    render() {
        return (
            <Card.Group>
                {this.state.matches && this.state.matches.map(match => (
                    <Card>
                        <Card.Content>
                        <Card.Header>
                            {match.leagueId}
                        </Card.Header>
                        </Card.Content>
                    </Card>
                ))}
            </Card.Group>
        )
    }

}