import React from 'react';
import { Icon, Dimmer, Loader } from 'semantic-ui-react';
import request from 'superagent'

export const getCurrentTimestamp = async () => {
  try {
    // const response = await request.get('http://worldtimeapi.org/api/timezone/Europe/Prague.json')
    // return new Date(response.body.unixtime * 1000).getTime();
    return new Date().getTime();
  } catch (error) {
    return new Date().getTime();
  }
}

export const canBetOnMatch = (bet, currentTimeStamp) => {
  return new Date(bet.matchDateTime).getTime() > currentTimeStamp;
}

export const canBetOnSpecial = (bet, currentTimeStamp) => {
  return new Date(bet.endDate).getTime() > currentTimeStamp;
}

export const getArrowIcon = (isUp) => {
  // todo check na serveru
  return (<Icon name={isUp ? 'angle up' : 'angle down'} />)
}

export const loadingComponent = (isLoading) => {
  if (isLoading) {
    return (
      <Dimmer active>
        <Loader size="big">Loading</Loader>
      </Dimmer>
    );
  }
  return null;
}
