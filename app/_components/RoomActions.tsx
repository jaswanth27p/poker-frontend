import React from 'react'
import CreateCard from './CreateCard';
import JoinCard from './JoinCard';

type Props = {}

export default function RoomActions({}: Props) {
  return (
    <>
      <div className="flex justify-between">
        <CreateCard/>
        <JoinCard/>
      </div>
    </>
  );
}