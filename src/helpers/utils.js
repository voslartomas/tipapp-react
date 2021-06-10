import React from 'react';
import { Icon, Dimmer, Loader } from 'semantic-ui-react';
import api from './api'

export const getCurrentTimestamp = async () => {
  try {
    const response = await api.get('ping/timestamp')
    return response.text
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
  return (<Icon size="big" name={isUp ? 'angle up' : 'angle down'} />)
}

export const loadingComponent = (isLoading) => {
  if (isLoading) {
    return (
      <div style={{ height: '100%', width: '100%'}}>
        <Dimmer active>
          <Loader size="big">Loading</Loader>
        </Dimmer>
      </div>
    );
  }
  return null;
}
