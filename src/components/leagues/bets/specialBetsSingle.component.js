import React, { useState, useEffect } from 'react'
import { Route, Link } from 'react-router-dom'
import { Card, Header, Button, Divider, Modal, Table } from 'semantic-ui-react'
import BetsSingleService from '../../../services/betsSingle.service'
import moment from 'moment'

export default function SpecialBetsSerieComponent(props) {
  const [bets, setBets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(async () => {
    await loadBets();
  }, [props.match.params.leagueId]);

  const loadBets = async () => {
    setIsLoading(true);
    const _bets = await BetsSingleService.getAll(props.match.params.leagueId)
    setBets(_bets);
    setOpen(false);
    setIsLoading(false);
  };

  const show = () => setOpen(true);

  const handleDeleteConfirm = async (betId) => {
    await BetsSingleService.delete(props.match.params.leagueId, betId);
    await loadBets();
  };

  const handleDeleteCancel = () => setOpen(false);

  return (
    <div>
      <Header as="h1">Single</Header>
      <Link to={`/leagues/${props.match.params.leagueId}/bets/single/form/new`}>
        <Button primary>
          Přidat tip na sérii
        </Button>
      </Link>
      <Divider />
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Typ</Table.HeaderCell>
            <Table.HeaderCell>Datum</Table.HeaderCell>
            <Table.HeaderCell>Výsledek</Table.HeaderCell>
            <Table.HeaderCell>Body</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bets && bets.map((bet, index) => (
            <Table.Row key={`${bet.id}_${index}`}>
              <Table.Cell>{bet.specialBetSingle.name}</Table.Cell>
              <Table.Cell>{moment(bet.dateTime).fromNow()}</Table.Cell>
              <Table.Cell>
                {bet.specialBetTeamResult && bet.specialBetTeamResult.team.name}
                {bet.specialBetPlayerResult && `${bet.specialBetPlayerResult.player.firstName} ${bet.specialBetPlayerResult.player.lastName}`}
                {bet.specialBetValue && bet.specialBetValue}
              </Table.Cell>
              <Table.Cell>{bet.points}</Table.Cell>
              <Table.Cell>
                <Link to={`/leagues/${props.match.params.leagueId}/bets/single/form/${bet.id}`} style={{marginRight: '5px'}}>Upravit</Link>
                <a href="#" onClick={() => show()}>Smazat</a>
                <Modal size='small' open={open} onClose={() => handleDeleteCancel()}>
                  <Modal.Header>
                    Smazat {bet.id} ?
                  </Modal.Header>
                  <Modal.Content>
                    <p>Chcete opravdu smazat tip '{bet.id}' ?</p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button negative onClick={() => handleDeleteCancel()}>
                      Ne
                    </Button>
                    <Button positive onClick={() => handleDeleteConfirm(bet.id)} icon='checkmark' labelPosition='right' content='Ano'/>
                  </Modal.Actions>
                </Modal>
              </Table.Cell>
            </Table.Row>
        ))}
        </Table.Body>
      </Table>
    </div>
  )
}
