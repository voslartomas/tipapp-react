import {React, Component} from 'react'
import SportService from '../../services/sport.service'
import { Card, Header, Form, Checkbox, Input, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'

export default class SportFormComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sport: {},
            redirect: undefined,
          }
    }

    async componentDidMount() {
        const sportId = this.props.match.params.sportId
        let sport = {}
        if (sportId !== 'new') {
            sport = await SportService.getSportById(sportId)
        }
    
        this.setState({
          sport,
        })
    }

    async saveForm() {
        if (this.state.sport.id) {
          await SportService.update(this.state.match, this.state.match.id)
        } else {
          await SportService.create(this.state.match)
        }
    
        this.setState({
          redirect: `/sports/${this.state.sport.id}`,
        })
    }

    render() {
        const { redirect } = this.state
    
        if (redirect) {
          return <Redirect to={redirect} />;
        }
    
        return (
          <div>
            <Header as="h1">Přidat/Upravit sport</Header>
            <Form onSubmit={() => this.saveForm()}>
              <Form.Field>
                <label>Český název</label>
                <Input
                  required
                  placeholder="Český název sportu"
                  value={this.state.sport.czName}
                  onChange={event => this.setState({ sport: { ...this.state.sport, name: event.target.value } })}
                />
              </Form.Field>
              <Form.Field>
                <label>Anglický název</label>
                <Input
                  required
                  placeholder="Anglický název sportu"
                  value={this.state.sport.enName}
                  onChange={event => this.setState({ sport: { ...this.state.sport, name: event.target.value } })}
                />
              </Form.Field>
              <Button type="submit">Potvrdit změny</Button>
            </Form>
          </div>
        )
      }

}