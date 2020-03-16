import React, { Component } from 'react'
import UserService from '../services/user.service'
import { Button, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class ProfileComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      open: false,
    }
  }

  show = () => this.setState({ open: true })
  handleDeleteCancel = () => this.setState({ open: false })
  handleDeleteConfirm = async (userId) => {
    this.setState({ open: false })
    await UserService.delete(userId)
    this.props.logout()
    this.loadUser()
  }
  
  async componentDidMount() {
    this.loadUser()
  }

  async loadUser() {
    const currentUser = await UserService.getCurrentUser()
    this.setState({ user: currentUser })
  }

  render() {
    return(
      <div>
        <h1>PROFIL</h1>
        <h3>{this.state.user.firstName} {this.state.user.lastName}</h3>
        <h3>{this.state.user.email}</h3>
        <h3>{this.state.user.mobileNumber}</h3>
        <Button color="green"><Link to={`/profile/edit/${this.state.user.id}`}>Editovat</Link></Button>
        <Button color="green"><Link to={`/profile/password`}>Změnit heslo</Link></Button>
        <Button color="red" onClick={this.show}>Smazat</Button>

        <Modal size='small' open={this.state.open} onClose={this.handleDeleteCancel}>
          <Modal.Header>
            Smazat uživatele {this.state.user.firstName + " " + this.state.user.lastName} ?
          </Modal.Header>
          <Modal.Content>
            <p>Chcete opravdu smazat uživatele "{this.state.user.firstName + " " + this.state.user.lastName}" ?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.handleDeleteCancel}>
              Ne
            </Button>
            <Button positive onClick={() => this.handleDeleteConfirm(this.state.user.id)} icon='checkmark' labelPosition='right' content='Ano'/>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}